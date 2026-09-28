const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { clerkMiddleware, getAuth } = require('@clerk/express');

// Gizli bilgiler koda yazılmaz, eksikse sunucu açılmaz (.env.example'a bak)
for (const key of ['DB_PASSWORD', 'JWT_SECRET', 'ADMIN_PASSWORD']) {
  if (!process.env[key]) throw new Error(`${key} tanımlı değil (.env)`);
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Clerk sadece kullanıcı uçlarında çalışır (admin'in kendi JWT'si Clerk'e takılmasın).
// İki anahtar da yoksa kapalı kalır, yoksa her istekte hata verir.
const clerkEnabled = process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY;
if (clerkEnabled) {
  app.use('/api/user', clerkMiddleware());
} else {
  console.log("UYARI: CLERK_SECRET_KEY / CLERK_PUBLISHABLE_KEY bulunamadi. Kullanici girisleri calismayacak!");
}

// Yüklenen dosyaları dışarıya sunmak için statik klasör
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Furkan'ın Admin Panelini sunmak için statik klasör
app.use('/furkan-panel', express.static(path.join(__dirname, 'admin')));

// ---------------- GÜVENLİK (MULTER DOSYA YÜKLEME) ----------------
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// SADECE GÜVENLİ DOSYA TÜRLERİNE İZİN VER (uzantı dosya adından değil, türden gelir)
const allowedTypes = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'audio/mpeg': '.mp3' };

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + allowedTypes[file.mimetype]);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    const err = new Error('Sadece JPG, PNG, WEBP resim ve MP3 ses dosyaları yüklenebilir!');
    err.status = 400;
    cb(err, false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max 20MB
  fileFilter: fileFilter 
});

// ---------------- GÜVENLİK (JWT AUTHENTICATION - ADMIN) ----------------
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ hata: 'Erişim engellendi. Token yok.' });
  
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ hata: 'Geçersiz veya süresi dolmuş token.' });
    if (decoded.role !== 'admin') return res.status(403).json({ hata: 'Admin yetkisi gerekiyor.' });
    req.admin = decoded;
    next();
  });
};

// ---------------- GÜVENLİK (JWT AUTHENTICATION - KULLANICI / CLERK) ----------------
// Mobil uygulama Clerk session token'ını "Authorization: Bearer ..." ile gönderir.
const authenticateUser = (req, res, next) => {
  if (!clerkEnabled) {
    return res.status(500).json({ hata: "Sunucuda Clerk Ayarları Eksik!" });
  }
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ hata: 'Giriş yapmanız gerekiyor.' });
  req.clerkUserId = userId;
  next();
};

// Veritabanı Bağlantısı
const pool = new Pool({
  user: process.env.DB_USER || 'kidly_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'masal_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// ---------------- ADMIN ENDPOINTLERI ----------------

// Admin Girişi (Furkan için)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ mesaj: 'Giriş başarılı', token });
  } else {
    res.status(401).json({ hata: 'Yanlış şifre!' });
  }
});

// Güvenli Dosya Yükleme (Sadece yetkili admin yükleyebilir)
app.post('/api/admin/upload', authenticateAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ hata: 'Dosya yüklenemedi.' });
  }
  // Göreli yol saklanır: domain/HTTPS değişince DB'deki adresler bozulmaz.
  // Uygulama bunu API adresinin başına ekler (örn. https://api.wobbi.app + /uploads/...)
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Yeni Karakter Ekle
app.post('/api/admin/characters', authenticateAdmin, async (req, res) => {
  try {
    const { name, bio, avatar_url, theme_color } = req.body;
    if (!name) return res.status(400).json({ hata: 'Karakter adı zorunlu.' });
    // Panel boş alanları '' gönderir, DB'ye NULL yazılsın
    const result = await pool.query(
      'INSERT INTO characters (name, bio, avatar_url, theme_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, bio || null, avatar_url || null, theme_color || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Yeni Hikaye (Kitap) Ekle
app.post('/api/admin/stories', authenticateAdmin, async (req, res) => {
  try {
    const { title, category, character_id, cover_url, duration_minutes, description } = req.body;
    if (!title) return res.status(400).json({ hata: 'Kitap başlığı zorunlu.' });
    const result = await pool.query(
      'INSERT INTO stories (title, category, character_id, cover_url, duration_minutes, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, category || null, character_id || null, cover_url || null, duration_minutes || null, description || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Hikaye Sayfası Ekle
app.post('/api/admin/story_pages', authenticateAdmin, async (req, res) => {
  try {
    const { story_id, page_number, image_url, audio_url, text_content, word_timestamps, magic_words } = req.body;
    if (!story_id || !page_number || !text_content) {
      return res.status(400).json({ hata: 'Kitap, sayfa numarası ve metin zorunlu.' });
    }
    const result = await pool.query(
      'INSERT INTO story_pages (story_id, page_number, image_url, audio_url, text_content, word_timestamps, magic_words) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [story_id, page_number, image_url || null, audio_url || null, text_content, JSON.stringify(word_timestamps), JSON.stringify(magic_words)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ---------------- GENEL ENDPOINTLER ----------------

// Test Endpoint'i
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      mesaj: 'Tebrikler! Masal App Backend ve Veritabani Baglantisi Basarili! 🚀',
      zaman: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// 1. Tüm Karakterleri Getir
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// 2. Tüm Hikayeleri (Kitapları) Getir
app.get('/api/stories', async (req, res) => {
  try {
    // Hikayeleri, karakter ismiyle beraber getiriyoruz
    const query = `
      SELECT s.*, c.name as character_name, c.theme_color 
      FROM stories s 
      LEFT JOIN characters c ON s.character_id = c.id 
      ORDER BY s.id ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// 3. Hikaye Detayını ve Sayfalarını Getir
app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Önce hikayenin ana bilgilerini alalım
    const storyResult = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    if (storyResult.rows.length === 0) {
      return res.status(404).json({ hata: 'Hikaye bulunamadı' });
    }
    const story = storyResult.rows[0];

    // Sonra hikayenin sayfalarını (metin, ses, sihirli kelimeler) alalım
    const pagesResult = await pool.query('SELECT * FROM story_pages WHERE story_id = $1 ORDER BY page_number ASC', [id]);
    
    // İkisini birleştirip tek JSON olarak dönüyoruz
    story.pages = pagesResult.rows;
    
    res.json(story);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ---------------- KULLANICI (USER) ENDPOINTLERI ----------------

// Not: Login/Register işlemi Frontend'de Clerk ile yapılıyor.
// Backend'de sadece "Lazy Creation" yapıyoruz. İlk istekte veritabanına kaydedilir.
const findUser = (clerkId) =>
  pool.query('SELECT id, email, is_premium FROM users WHERE clerk_id = $1', [clerkId]);

const getOrCreateUser = async (clerkId) => {
  let { rows } = await findUser(clerkId);
  if (rows.length === 0) {
    // Clerk'ten email gelmemişse geçici bir email oluştur.
    // ON CONFLICT: uygulama ilk açılışta aynı anda iki istek atarsa ikincisi hata vermesin.
    await pool.query(
      'INSERT INTO users (email, clerk_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [`${clerkId}@wobbi.local`, clerkId]
    );
    ({ rows } = await findUser(clerkId));
  }
  return rows[0];
};

// Okunan farklı hikaye ve kategori sayısı (tekrar okumalar sayılmaz)
const getReadStats = async (userId) => {
  const { rows } = await pool.query(`
    SELECT COUNT(DISTINCT h.story_id)::int AS stories, COUNT(DISTINCT s.category)::int AS categories
    FROM user_read_history h
    JOIN stories s ON s.id = h.story_id
    WHERE h.user_id = $1
  `, [userId]);
  return rows[0];
};

// Kullanıcı Profilini ve Rozetlerini Getir
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    const userProfile = await getOrCreateUser(req.clerkUserId);
    const userId = userProfile.id; // Postgres'teki asıl ID'miz

    const badgesRes = await pool.query(`
      SELECT b.name, b.description, b.icon_url, ub.earned_at 
      FROM user_badges ub 
      JOIN badges b ON ub.badge_id = b.id 
      WHERE ub.user_id = $1
    `, [userId]);
    
    const stats = await getReadStats(userId);

    res.json({
      ...userProfile,
      total_stories_read: stats.stories,
      badges: badgesRes.rows
    });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Hikaye Okumayı Tamamlama (Limit Kontrolü ve Rozet Kazanımı)
app.post('/api/user/read-story', authenticateUser, async (req, res) => {
  try {
    const storyId = Number(req.body.story_id);
    if (!Number.isInteger(storyId)) return res.status(400).json({ hata: 'Geçerli bir story_id gerekli.' });
    const storyRes = await pool.query('SELECT 1 FROM stories WHERE id = $1', [storyId]);
    if (storyRes.rowCount === 0) return res.status(404).json({ hata: 'Hikaye bulunamadı' });

    const userProfile = await getOrCreateUser(req.clerkUserId);
    const userId = userProfile.id;

    // 1. Limit Kontrolü (bugün okunan hikayeyi tekrar okumak hakkı yakmaz)
    if (!userProfile.is_premium) {
      const todayRes = await pool.query(
        'SELECT COUNT(*) as today_count FROM user_read_history WHERE user_id = $1 AND read_date = CURRENT_DATE AND story_id <> $2',
        [userId, storyId]
      );
      if (parseInt(todayRes.rows[0].today_count) >= 1) {
        return res.status(403).json({ 
          hata: 'Günlük ücretsiz okuma limitine ulaştınız. Sınırsız okuma için Premium\'a geçin.', 
          limit_reached: true 
        });
      }
    }

    // 2. Geçmişe Ekle
    await pool.query(
      'INSERT INTO user_read_history (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, storyId]
    );

    // 3. Rozet Kontrolleri (Oyunlaştırma)
    const stats = await getReadStats(userId);

    let newBadges = [];

    const awardBadge = async (code) => {
      const badgeRes = await pool.query('SELECT id, name FROM badges WHERE code = $1', [code]);
      if (badgeRes.rows.length > 0) {
        const badgeId = badgeRes.rows[0].id;
        const awardRes = await pool.query(
          'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
          [userId, badgeId]
        );
        if (awardRes.rowCount > 0) newBadges.push(badgeRes.rows[0].name);
      }
    };

    // >= : rozet sonradan eklense de hak eden herkes bir sonraki okumada alır (tekrar verilmez, ON CONFLICT)
    if (stats.stories >= 1) await awardBadge('FIRST_STEP');
    if (stats.stories >= 5) await awardBadge('BOOKWORM');
    if (stats.categories >= 3) await awardBadge('EXPLORER');
    // NIGHT_OWL: uyku modu verisi gelince eklenecek

    res.json({ mesaj: 'Hikaye okuma başarıyla kaydedildi.', new_badges_earned: newBadges });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Yakalanmayan hatalar (dosya türü/boyutu, bozuk JSON vb.) HTML yerine JSON dönsün
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ hata: 'Dosya 20 MB\'dan büyük olamaz.' });
  const status = err.status || (err instanceof multer.MulterError ? 400 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ hata: status < 500 ? err.message : 'Sunucu hatası.' });
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
