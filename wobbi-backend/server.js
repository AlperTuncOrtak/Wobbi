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

// ---------------- GÜVENLİK (JWT AUTHENTICATION) ----------------
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ hata: 'Erişim engellendi. Token yok.' });
  
  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'wobbi_secret_key', (err, decoded) => {
    if (err) return res.status(403).json({ hata: 'Geçersiz veya süresi dolmuş token.' });
    req.admin = decoded;
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

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
