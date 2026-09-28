-- API v1 (API.md): günlük hak açılışta düşer, bitirme ayrı işaretlenir, favoriler hesaba bağlı.
-- Tekrar çalıştırmak güvenli. Çalıştır: sudo -u postgres psql -v ON_ERROR_STOP=1 -d masal_db -f bu_dosya.sql

-- Açılan hikaye satırı; bitince doldurulur (rozetler bitenleri sayar)
ALTER TABLE user_read_history ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS user_favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    story_id INT REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, story_id)
);
GRANT ALL PRIVILEGES ON user_favorites TO kidly_admin;

-- Sunucu UTC; günlük limit ve seri Türkiye gününe göre dönsün (yeni bağlantılarda geçerli)
ALTER DATABASE masal_db SET timezone TO 'Europe/Istanbul';
