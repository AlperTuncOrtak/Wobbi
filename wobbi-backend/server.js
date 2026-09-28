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

// Clerk sadece authenticateUser kullanan uçlarda çalışır (admin'in kendi JWT'si Clerk'e takılmasın).
// İki anahtar da yoksa kapalı kalır, yoksa her istekte hata verir.
const clerk = process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY && clerkMiddleware();
if (!clerk) {
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
  if (!clerk) {
    return res.status(500).json({ hata: "Sunucuda Clerk Ayarları Eksik!" });
  }
  clerk(req, res, (err) => {
    if (err) return next(err);
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ hata: 'Giriş yapmanız gerekiyor.' });
    req.clerkUserId = userId;
    next();
  });
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

// Bundan sonraki uçlarda try/catch yok: Express 5 async hataları en alttaki JSON hata yakalayıcısına iletir.
// API sözleşmesi: API.md

// 1. Karakterler (story_count canlı hesaplanır)
app.get('/api/characters', async (req, res) => {
  const result = await pool.query(`
    SELECT c.id, c.name, c.bio, c.avatar_url, c.theme_color, COUNT(s.id)::int AS story_count
    FROM characters c
    LEFT JOIN stories s ON s.character_id = c.id
    GROUP BY c.id
    ORDER BY c.id
  `);
  res.json(result.rows);
});

// Liste kartındaki hikaye alanları (sayfalar hariç). Hikaye listesi, detay ve favoriler kullanır.
const STORY_CARD_SQL = `
  SELECT s.id, s.title, s.description, s.category, s.cover_url, s.duration_minutes,
         s.character_id, c.name AS character_name, c.theme_color,
         (SELECT COUNT(*)::int FROM story_pages p WHERE p.story_id = s.id) AS page_count
  FROM stories s
  LEFT JOIN characters c ON c.id = s.character_id`;

// "abc", "-1" gibi id'ler DB hatası yerine null olsun (sorgu 0 satır döner)
const toId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// 2. Tüm hikayeler (herkese açık). Karakter/kategori filtresini uygulama kendisi yapar.
// ponytail: filtre/sayfalama yok; katalog yüzlerce hikayeyi geçince ?character_id= ve ?limit= ekle
app.get('/api/stories', async (req, res) => {
  const result = await pool.query(`${STORY_CARD_SQL} ORDER BY s.id`);
  res.json(result.rows);
});

// 3. Hikaye + sayfalar. Giriş ister; ücretsiz kullanıcının günlük hakkı burada düşer.
app.get('/api/stories/:id', authenticateUser, async (req, res) => {
  const storyId = toId(req.params.id);
  const storyRes = await pool.query(`${STORY_CARD_SQL} WHERE s.id = $1`, [storyId]);
  if (storyRes.rows.length === 0) return res.status(404).json({ hata: 'Hikaye bulunamadı' });

  const user = await getOrCreateUser(req.clerkUserId);
  // Bugün açılan hikayeyi tekrar açmak hakkı yakmaz.
  // ponytail: aynı anda iki farklı hikaye açılırsa ikisi de geçebilir; sorun olursa kullanıcı satırında FOR UPDATE
  if (!user.is_premium) {
    const todayRes = await pool.query(
      'SELECT 1 FROM user_read_history WHERE user_id = $1 AND read_date = CURRENT_DATE AND story_id <> $2',
      [user.id, storyId]
    );
    if (todayRes.rowCount > 0) {
      return res.status(403).json({
        hata: 'Günlük ücretsiz okuma limitine ulaştınız. Sınırsız okuma için Premium\'a geçin.',
        limit_reached: true
      });
    }
  }
  await pool.query(
    'INSERT INTO user_read_history (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [user.id, storyId]
  );

  const pagesRes = await pool.query(
    'SELECT id, page_number, image_url, audio_url, text_content, word_timestamps, magic_words FROM story_pages WHERE story_id = $1 ORDER BY page_number',
    [storyId]
  );
  res.json({ ...storyRes.rows[0], pages: pagesRes.rows });
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

// Bitirilen farklı hikaye ve kategori sayısı (tekrar okumalar sayılmaz)
const getReadStats = async (userId) => {
  const { rows } = await pool.query(`
    SELECT COUNT(DISTINCT h.story_id)::int AS stories, COUNT(DISTINCT s.category)::int AS categories
    FROM user_read_history h
    JOIN stories s ON s.id = h.story_id
    WHERE h.user_id = $1 AND h.completed_at IS NOT NULL
  `, [userId]);
  return rows[0];
};

// Kullanıcı Profili: istatistik, seri, bugünkü hikaye ve TÜM rozetler (kazanılmamışlarda earned_at = null)
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  const user = await getOrCreateUser(req.clerkUserId);

  const badgesRes = await pool.query(`
    SELECT b.code, b.name, b.description, b.icon_url, ub.earned_at
    FROM badges b
    LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
    ORDER BY b.id
  `, [user.id]);

  // Günlük seri: bugün veya dün biten ardışık okuma günleri.
  // Ardışık günlerde (tarih - sıra no) aynı kalır, o grubun büyüklüğü seriyi verir.
  const streakRes = await pool.query(`
    WITH days AS (SELECT DISTINCT read_date FROM user_read_history WHERE user_id = $1),
    groups AS (SELECT read_date, read_date - (ROW_NUMBER() OVER (ORDER BY read_date))::int AS grp FROM days)
    SELECT COUNT(*)::int AS streak FROM groups
    WHERE grp = (SELECT grp FROM groups WHERE read_date >= CURRENT_DATE - 1 ORDER BY read_date DESC LIMIT 1)
  `, [user.id]);

  const todayRes = await pool.query(
    'SELECT story_id FROM user_read_history WHERE user_id = $1 AND read_date = CURRENT_DATE ORDER BY created_at LIMIT 1',
    [user.id]
  );

  const stats = await getReadStats(user.id);

  res.json({
    ...user,
    total_stories_read: stats.stories,
    streak_days: streakRes.rows[0].streak,
    today_story_id: todayRes.rows[0]?.story_id ?? null,
    badges: badgesRes.rows
  });
});

// Hikaye bitti: geçmişte tamamlandı olarak işaretlenir, rozetler verilir. (Günlük hak açılışta düşer.)
app.post('/api/user/finish-story', authenticateUser, async (req, res) => {
  const storyId = toId(req.body.story_id);
  if (!storyId) return res.status(400).json({ hata: 'Geçerli bir story_id gerekli.' });
  const user = await getOrCreateUser(req.clerkUserId);

  // Hiç açılmamış hikayede 0 satır güncellenir, dolayısıyla rozet de gelmez
  await pool.query(
    'UPDATE user_read_history SET completed_at = NOW() WHERE user_id = $1 AND story_id = $2 AND completed_at IS NULL',
    [user.id, storyId]
  );

  const stats = await getReadStats(user.id);
  const newBadges = [];

  const awardBadge = async (code) => {
    const badgeRes = await pool.query('SELECT id, name FROM badges WHERE code = $1', [code]);
    if (badgeRes.rows.length > 0) {
      const awardRes = await pool.query(
        'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
        [user.id, badgeRes.rows[0].id]
      );
      if (awardRes.rowCount > 0) newBadges.push(badgeRes.rows[0].name);
    }
  };

  // >= : rozet sonradan eklense de hak eden herkes bir sonraki okumada alır (tekrar verilmez, ON CONFLICT)
  if (stats.stories >= 1) await awardBadge('FIRST_STEP');
  if (stats.stories >= 5) await awardBadge('BOOKWORM');
  if (stats.categories >= 3) await awardBadge('EXPLORER');
  // NIGHT_OWL: uyku modu verisi gelince eklenecek

  res.json({ mesaj: 'Hikaye tamamlandı.', new_badges_earned: newBadges });
});

// Favoriler (Kitaplığım > Favorilerim), en son eklenen önce
app.get('/api/user/favorites', authenticateUser, async (req, res) => {
  const user = await getOrCreateUser(req.clerkUserId);
  const result = await pool.query(
    `${STORY_CARD_SQL} JOIN user_favorites f ON f.story_id = s.id WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
    [user.id]
  );
  res.json(result.rows);
});

// Tekrar eklemek/silmek hata vermez; olmayan hikaye eklenmez (INSERT ... SELECT 0 satır)
app.put('/api/user/favorites/:storyId', authenticateUser, async (req, res) => {
  const user = await getOrCreateUser(req.clerkUserId);
  await pool.query(
    'INSERT INTO user_favorites (user_id, story_id) SELECT $1::int, id FROM stories WHERE id = $2 ON CONFLICT DO NOTHING',
    [user.id, toId(req.params.storyId)]
  );
  res.status(204).end();
});

app.delete('/api/user/favorites/:storyId', authenticateUser, async (req, res) => {
  const user = await getOrCreateUser(req.clerkUserId);
  await pool.query(
    'DELETE FROM user_favorites WHERE user_id = $1 AND story_id = $2',
    [user.id, toId(req.params.storyId)]
  );
  res.status(204).end();
});

// Bilinmeyen adresler de { hata } dönsün (uygulama her hatayı aynı şekilde okur)
app.use((req, res) => res.status(404).json({ hata: 'Bulunamadı.' }));

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
