-- Kullanıcılar (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    parent_pin VARCHAR(4),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Okuma Geçmişi ve Limit Takibi (Günlük 1 hak)
CREATE TABLE IF NOT EXISTS user_read_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    story_id INT REFERENCES stories(id) ON DELETE CASCADE,
    read_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, story_id, read_date)
);

-- Rozetler (Katalog)
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255)
);

-- Kullanıcının Kazandığı Rozetler
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Rozet Katalog Verileri
INSERT INTO badges (code, name, description, icon_url) VALUES 
('FIRST_STEP', 'İlk Adım', 'İlk hikayeni başarıyla bitirdin!', 'https://via.placeholder.com/150?text=IlkAdim'),
('BOOKWORM', 'Kitap Kurdu', 'Tam 5 hikaye okuyarak gerçek bir kitap kurdu oldun!', 'https://via.placeholder.com/150?text=KitapKurdu'),
('EXPLORER', 'Kâşif', '3 farklı kategoriden kitap okudun, yeni dünyalar seni bekliyor!', 'https://via.placeholder.com/150?text=Kasif'),
('NIGHT_OWL', 'Gece Kuşu', 'Uyku modunda arka arkaya 3 gece hikaye dinledin.', 'https://via.placeholder.com/150?text=GeceKusu')
ON CONFLICT DO NOTHING;

-- Örnek bir kullanıcı ekleyelim (Test için)
INSERT INTO users (email, parent_pin, is_premium) VALUES 
('testaile@wobbi.com', '1234', FALSE)
ON CONFLICT DO NOTHING;

-- Yetkilendirmeleri yenile
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kidly_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kidly_admin;
