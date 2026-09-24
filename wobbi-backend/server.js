const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Yüklenen dosyaları dışarıya sunmak için statik klasör
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Furkan'ın Admin Panelini sunmak için statik klasör
app.use('/furkan-panel', express.static(path.join(__dirname, 'admin')));

// ---------------- GÜVENLİK (MULTER DOSYA YÜKLEME) ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Rastgele isim ve güvenli uzantı
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// SADECE GÜVENLİ DOSYA TÜRLERİNE İZİN VER (Zararlı yazılım engelleme)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Güvenlik İhlali: Sadece resim ve ses dosyaları yüklenebilir!'), false);
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
  
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'wobbi_secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ hata: 'Geçersiz veya süresi dolmuş token.' });
    if (decoded.role !== 'admin') return res.status(403).json({ hata: 'Admin yetkisi gerekiyor.' });
    req.admin = decoded;
    next();
  });
};

// ---------------- GÜVENLİK (JWT AUTHENTICATION - KULLANICI) ----------------
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ hata: 'Erişim engellendi. Token yok.' });
  
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'wobbi_secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ hata: 'Geçersiz veya süresi dolmuş token.' });
    req.user = decoded; // { id, email, is_premium }
    next();
  });
};

// Veritabanı Bağlantısı
const pool = new Pool({
  user: process.env.DB_USER || 'kidly_admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'masal_db',
  password: process.env.DB_PASSWORD || 'MasalSifre_2026',
  port: process.env.DB_PORT || 5432,
});

// ---------------- ADMIN ENDPOINTLERI ----------------

// Admin Girişi (Furkan için)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'FurkanWobbi2026';
  
  if (password === adminPassword) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'wobbi_secret_key', { expiresIn: '12h' });
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
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Yeni Karakter Ekle
app.post('/api/admin/characters', authenticateAdmin, async (req, res) => {
  try {
    const { name, bio, avatar_url, theme_color } = req.body;
    const result = await pool.query(
      'INSERT INTO characters (name, bio, avatar_url, theme_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, bio, avatar_url, theme_color]
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
    const result = await pool.query(
      'INSERT INTO stories (title, category, character_id, cover_url, duration_minutes, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, category, character_id, cover_url, duration_minutes, description]
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
    const result = await pool.query(
      'INSERT INTO story_pages (story_id, page_number, image_url, audio_url, text_content, word_timestamps, magic_words) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [story_id, page_number, image_url, audio_url, text_content, JSON.stringify(word_timestamps), JSON.stringify(magic_words)]
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

// Mock Google Login / Kayıt (App içinden Google Auth sonrası buraya istek atılacak)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, google_id } = req.body;
    if (!email) return res.status(400).json({ hata: 'Email zorunlu' });

    // Kullanıcı var mı kontrol et, yoksa yarat
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;
    
    if (userResult.rows.length === 0) {
      // İlk defa giren kullanıcı (Kayıt)
      const insertRes = await pool.query(
        'INSERT INTO users (email, google_id) VALUES ($1, $2) RETURNING *',
        [email, google_id]
      );
      user = insertRes.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Kullanıcı için token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, is_premium: user.is_premium }, 
      process.env.JWT_SECRET || 'wobbi_secret_key', 
      { expiresIn: '30d' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, is_premium: user.is_premium } });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Kullanıcı Profilini ve Rozetlerini Getir
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userRes = await pool.query('SELECT id, email, is_premium, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ hata: 'Kullanıcı bulunamadı' });
    const userProfile = userRes.rows[0];

    const badgesRes = await pool.query(`
      SELECT b.name, b.description, b.icon_url, ub.earned_at 
      FROM user_badges ub 
      JOIN badges b ON ub.badge_id = b.id 
      WHERE ub.user_id = $1
    `, [userId]);
    
    const historyRes = await pool.query('SELECT COUNT(*) as total_read FROM user_read_history WHERE user_id = $1', [userId]);

    res.json({
      ...userProfile,
      total_stories_read: parseInt(historyRes.rows[0].total_read),
      badges: badgesRes.rows
    });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// Hikaye Okumayı Tamamlama (Limit Kontrolü ve Rozet Kazanımı)
app.post('/api/user/read-story', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { story_id } = req.body;
    
    // 1. Limit Kontrolü (Ücretsiz kullanıcılar günde 1 tane okuyabilir)
    if (!req.user.is_premium) {
      const todayRes = await pool.query(
        'SELECT COUNT(*) as today_count FROM user_read_history WHERE user_id = $1 AND read_date = CURRENT_DATE', 
        [userId]
      );
      if (parseInt(todayRes.rows[0].today_count) >= 1) {
        return res.status(403).json({ 
          hata: 'Günlük ücretsiz okuma limitine ulaştınız. Sınırsız okuma için Premium\'a geçin.', 
          limit_reached: true 
        });
      }
    }

    // 2. Geçmişe Ekle (Aynı gün aynı kitabı bir kez kaydetmek için ON CONFLICT)
    await pool.query(
      'INSERT INTO user_read_history (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, story_id]
    );

    // 3. Rozet Kontrolleri (Oyunlaştırma)
    const historyRes = await pool.query('SELECT COUNT(*) as total_read FROM user_read_history WHERE user_id = $1', [userId]);
    const totalRead = parseInt(historyRes.rows[0].total_read);
    
    let newBadges = [];

    // Yardımcı Fonksiyon: Rozet Ekleme
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

    if (totalRead === 1) await awardBadge('FIRST_STEP');
    if (totalRead === 5) await awardBadge('BOOKWORM');
    
    res.json({ mesaj: 'Hikaye okuma başarıyla kaydedildi.', new_badges_earned: newBadges });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
