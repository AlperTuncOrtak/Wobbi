# 📚 Çocuk Okuma Uygulaması — Güncellenmiş Master Plan

> **MVP Hedef:** 5–8 yaş | **Dil:** TR + EN | **Model:** Freemium | **Strateji:** React Native (Cross-Platform)

---

## 👥 Ekip Rolleri

| Rol | Kişi | Sorumluluk |
|-----|------|-----------|
| 🛠️ Yazılım + Altyapı | Sen + Antigravity | Backend, frontend, store yayını |
| ✍️ İçerik + Ses | Arkadaş 1 | Hikaye yazımı, ElevenLabs seslendirme, fon müziği |
| 🎨 Görsel + UI/UX | Arkadaş 2 | Midjourney sahneler, Lottie animasyon, Figma UI |

---

## 🎯 Ürün Konsepti ve USP

### Ana Fark Yaratanlar (Rakipten Ayıran)
| Özellik | Kidly | Bizim Uygulama |
|---------|-------|----------------|
| Keşfet deneyimi | Statik önizlemeler | **Reels tarzı dikey akış (15-30s)** |
| Seslendirme | Sabit anlatıcı | **Ebeveyn ses klonlama (v1.1)** |
| Uyku geçişi | Yok | **Akıllı Fade-out + ninni modu** |
| Hikaye yapısı | Doğrusal | **Dinamik seçim ("Kendi maceranı kendin seç")** |
| Ebeveyn kontrolü | Açık ayarlar | **PIN korumalı şifreli kontrol merkezi** |
| Freemium model | 3. sayfada duvar | **Günde 1 ücretsiz + ödüllü reklam seçeneği** |
| Dil | TR veya EN | **Tek dokunuşla TR/EN geçiş (v1.1)** |
| Çevrimdışı | Sınırlı | **Tam offline pre-load** |

---

## 🏗️ Teknik Mimari

### 📱 Frontend (React Native - Expo)
```
Aşama 1 — Android Odaklı MVP (Google Play Store)
  ├── İlk aşamada sadece Google Play Store hedeflenecek.
  ├── "Sign in with Google" (Google ile Giriş) eklenecek.
  ├── Tüm limitler cihaz değil, Kullanıcı Hesabı bazlı tutulacak.
  └── Mobile-first, tam ekran, çocuk dostu uygulama hissi.

Aşama 2 — iOS ve Genişleme
  ├── App Store maliyetleri (99$) karşılanıp Apple Login eklenecek.
  └── Lottie animasyonları ve haptic feedback iyileştirilecek.
```

### ☁️ Backend (Oracle Cloud Free Tier)
```
Oracle Cloud
  ├── Compute VM (AMD) ── Node.js + Express API
  ├── PostgreSQL ────────── Kullanıcı, hikaye, ilerleme verileri
  └── Object Storage ────── Ses dosyaları (MP3) + Görseller (WebP/PNG)
                            Lottie JSON dosyaları
```

### 🎨 Görsel Stack
```
Midjourney (--cref parametresi)
  └── Karakter tutarlılığı olan arka plan sahneleri → PNG/WebP

Lottie Animasyonlar (JSON)
  └── Karakter hareketleri, ifadeler, geçiş efektleri
  └── Adobe After Effects → LottieFiles export
  └── Flutter: lottie paketi | PWA: lottie-web kütüphanesi

Birleşim: Midjourney arka plan + Lottie karakter katmanı (overlay)
```

### 🔊 Ses Stack
```
MVP (v1.0):
  ElevenLabs API ── Standart çocuk anlatıcı sesi
  └── Türkçe + İngilizce
  └── Her hikaye için önceden üretilip Object Storage'a yükleme
  └── API maliyeti: ~0.18$/1K karakter → 50 hikaye ≈ 5-10$

v1.1 (Ebeveyn Ses Klonlama):
  ElevenLabs Voice Cloning API
  └── 1-2 dakika ses kaydı → tüm kütüphane ebeveyn sesiyle
  └── Premium özellik (kotali veya ek ücret)
```

---

## ✅ MVP Özellikleri (v1.0)

### 🎬 Çift Ekran Deneyimi
**Reels Formatı (Keşfet):**
- Dikey kaydırma (scroll snap)
- 15-30 saniyelik sesli+animasyonlu önizleme
- "Devam et" butonu → tam hikayeye geçiş

**Klasik Okuma:**
- Sayfa sayfa metin + Midjourney görsel
- Karaoke kelime vurgusu (ses ilerlerken kelime renklenir)
- Ses kontrolü (oynat/duraklat/hız)

### 🌙 Akıllı Uyku Geçişi (Fade-out Modu)
- Hikaye sonuna yakın ekran kademeli kararır
- Ses otomatik ninniye/beyaz gürültüye dönüşür
- Dikey kaydırma kilitlenir
- 15 dk boyunca ay/yıldız animasyonu kalır

### 🎮 Dinamik Hikaye Seçimi
- Sahne sonunda 2 büyük seçenek butonu
- Çocuğun seçimine göre hikaye yön değiştirir
- Basit karar ağacı (her hikayede 2-3 dal)

### 📳 Haptic + Ambiyans Efektleri
- Yağmur sahnesi → hafif titreşim (haptic)
- Gök gürültüsü → ekran anlık parıldama
- Rüzgar/orman sesleri → arka plan ambiyans ses katmanı

### 👨‍👩‍👧 Ebeveyn & Üyelik Sistemi (Kullanıcı Odaklı)
- **Hesap Yönetimi:** Kullanıcılar cihaz bağımsız "Kullanıcı Hesabı" (Google ile Giriş / E-posta) üzerinden sistemi kullanır.
- 4 haneli PIN ile kilitleme (Ebeveyn alanına geçiş)
- Ödeme ve Abonelikler **Google Play Billing** üzerinden tek hesaba işlenir.
- Ekran süresi sınırı ve günlük okuma limitleri bulut (veritabanı) üzerinden takip edilir.
- Haftalık okuma raporu (duygusal tema analizi)

### 📊 Haftalık Ebeveyn Raporu
- Kaç hikaye okundu, kaç dakika
- En çok sevilen duygusal temalar
- Yeni öğrenilen kelime sayısı tahmini
- E-posta veya uygulama içi bildirim

### ❤️ Favori + İlerleme
- Kitaplığa ekleme (Kullanıcı hesabına kaydedilir)
- Son okunan sayfa kaydı
- Offline pre-load (indirme butonu)

### 🔓 Freemium Model
| Kullanıcı Tipi | Ne Alır? |
|---------------|---------|
| Ücretsiz Üye | Günde 1 hikaye hakkı (Hesap bazlı sınır) |
| Ödüllü Reklam | 30s reklam → ek 1 hikaye hakkı |
| Premium Üye | Google Play Aboneliği ile Sınırsız hikaye |

---

## 📁 İçerik ve Veri Formatı

### Hikaye JSON Yapısı
```json
{
  "id": "story_001",
  "title": { "tr": "Küçük Tilki", "en": "Little Fox" },
  "age_range": [5, 8],
  "duration_seconds": 180,
  "scenes": [
    {
      "scene_id": 1,
      "text": { "tr": "Bir varmış bir yokmuş...", "en": "Once upon a time..." },
      "image_url": "oracle_storage/scenes/s001_bg.webp",
      "lottie_url": "oracle_storage/animations/fox_walk.json",
      "audio_url": { "tr": "oracle_storage/audio/tr/s001.mp3", "en": "oracle_storage/audio/en/s001.mp3" },
      "audio_duration": 12.4,
      "word_timestamps": [0.0, 0.8, 1.5, 2.3],
      "choices": [
        { "label": { "tr": "Ormana git" }, "next_scene": 2 },
        { "label": { "tr": "Nehre git" }, "next_scene": 5 }
      ],
      "haptic": "light",
      "ambient_sound": "forest"
    }
  ],
  "sleep_mode": true,
  "sensitive_words": ["canavar", "kötü"],
  "emotional_themes": ["cesaret", "dostluk"]
}
```

---

## 🗺️ Geliştirme Yol Haritası

### Faz 0 — Altyapı Kurulumu
**Yazılım:**
- [ ] Oracle Cloud VM kurulumu (Node.js + PostgreSQL + Object Storage)
- [ ] Domain + HTTPS (Let's Encrypt)
- [ ] API endpoint tasarımı (hikayeler, kullanıcı, ilerleme, ses)
- [ ] ElevenLabs API entegrasyonu testi

**İçerik:**
- [ ] İlk 3 hikayenin yazılması + pedagojik kontrol
- [ ] ElevenLabs ile TR + EN seslendirme üretimi

**Görsel:**
- [ ] Midjourney karakter referansı (--cref) oluşturma
- [ ] Figma'da ekran akışı (wireframe → UI)
- [ ] İlk Lottie animasyon testi (LottieFiles)

---

### Faz 1 — React Native MVP
**Yazılım:**
- [ ] React Native (Expo) kurulumu (iOS + Android)
- [ ] Reels formatı (dikey scroll snap, ses otomatik başlatma)
- [ ] Klasik okuma ekranı (metin + görsel + ses)
- [ ] Karaoke kelime vurgusu (word timestamp senkronizasyonu)
- [ ] Fade-out uyku modu
- [ ] Dinamik hikaye seçim sistemi (karar ağacı)
- [ ] PIN korumalı ebeveyn paneli
- [ ] Offline pre-load (Service Worker)
- [ ] Freemium kapı (günde 1 ücretsiz + reklam bypass)

---

### Faz 2 — Kullanıcı Testi ve İyileştirme
- [ ] 3-5 çocuklu aile ile test
- [ ] Geri bildirim toplama (Maze veya basit form)
- [ ] Haptic efektler, ambiyans ses katmanı
- [ ] Haftalık ebeveyn raporu
- [ ] ElevenLabs ses kalitesi ince ayarı

---

### Faz 3 — Mağaza Yayını (Google Play Store)
- [ ] Google Play Console geliştirici hesabı açılışı
- [ ] Google Play Billing (Uygulama İçi Satın Alma) entegrasyonu
- [ ] COPPA / KVKK uyumu + Gizlilik politikası oluşturulması
- [ ] Google Play İç Test ve Kapalı Test aşamaları (20 tester kuralı vb.)
- [ ] Google Play Store yayını 🚀

---

### Faz 4 — v1.1 Özellikleri
- [ ] Ebeveyn ses klonlama (ElevenLabs Voice Cloning)
- [ ] Çift dilli geçiş anahtarı (TR/EN anında)
- [ ] Çizimi masala dönüştürme (görsel AI)
- [ ] Liderlik tablosu + aile arkadaş çemberi
- [ ] Hikaye sonu mini oyunlar (kelime avı, sahne boyama)

---

## ⚖️ Yasal Zorunluluklar

> [!IMPORTANT]
> Çocuk uygulamaları özel düzenlemelere tabidir.

- **COPPA (ABD):** 13 yaş altı → ebeveyn onayı zorunlu
- **KVKK (TR):** Kişisel veri işleme açık rızası
- **App Store Kural 1.3:** Çocuk uygulamalarında üçüncü taraf reklam yasak
  - **Çözüm:** Ödüllü reklam → ebeveyn onayıyla açılır
- **Tüm auth ebeveyn üzerinden** → çocuk profili ebeveyne bağlı

---

## 💰 Bütçe Tahmini (MVP)

| Kalem | Maliyet |
|-------|---------|
| Oracle Cloud | **0$** (Free Tier) |
| ElevenLabs (ilk 50 hikaye seslendirme) | **~10$** |
| Midjourney (görsel üretim) | **~10-30$** |
| LottieFiles animasyonlar | **0$** (açık kaynak kütüphane) |
| Domain + SSL | **~10$/yıl** |
| PWA testi | **0$** |
| **TOPLAM MVP** | **~30-50$** |
| Google Play kayıt | **25$** (tek seferlik) |
| Apple Developer | **99$/yıl** |

---

*Plan güncellendi: Eylül 2026*
