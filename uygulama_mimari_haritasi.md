# 🗺️ Masal App - Mimari ve Ekran Haritası

## 📱 Genel Navigasyon (Bottom Navigation Bar)
Uygulamanın en altında her zaman görünen 4 ana menü butonu olacak:
1. **🏠 Keşfet (Büyülü Kütüphane)** - Dikey Reels tarzı fragmanlar (Ebeveyn kontrollü)
2. **📚 Kitaplar** - Tüm hikayelerin kategori bazlı listelendiği ana katalog
3. **🦊 Karakterler** - Netflix tarzı karakter seçim ekranı
4. **❤️ Kitaplığım** - Kaydedilenler ve çevrimdışı okunanlar

---

## 📺 Ekranların Detaylı Yerleşimi

### 1. 🏠 Keşfet / Büyülü Kütüphane (Ana Ekran)
**Amacı:** Sosyal medya akışı yerine, sakin, eğitici ve seçime dayalı bir dijital kütüphane.
> **⚠️ Ebeveyn Kilidi (Anti-Bağımlılık Modu):** Çocuğun fragmanlar (reels) arasında sonsuz kaydırma yapıp dopamine kapılmasını engellemek için, bu sayfa **Ebeveyn Şifresi** ile girilebilecek veya ayarlardan ebeveyn tarafından süreli olarak (örn: günde 10 dk) aktif edilebilecek özel bir alandır.
- **Yapı:** Grid (Izgara) veya yatay kaydırmalı (Carousel) kitaplık rafları.
- **Ekranda Olanlar:**
  - Günün Masalı (Büyük banner)
  - Yeni Eklenenler, Popüler Masallar kategorileri
  - Sol üstte minik ebeveyn gizli butonu (Şifreli Ayarlar)
  - Bir kitaba/karaktere tıklayınca -> **Hikaye Fragmanı'na** gider.

#### ↳ 1.1. Hikaye Fragmanı (Dikey Önizleme)
**Amacı:** Çocuğun kitabı seçmeden önce modern ve akıcı bir şekilde incelemesi (Reels formatının eğitici hali).
- **Yapı:** Dikey (Tam ekran) kısa animasyon ve ses.
- **Ekranda Olanlar:**
  - 15 saniyelik animasyon + seslendirme önizlemesi
  - Kocaman **"📖 Hikayeye Başla"** butonu (Asıl okumaya geçirir)
  - 💙 Beğen (Gizli sayaç, kişisel algoritmayı eğitir)
  - ➕ Kitaplığa Ekle (Sonra okumak için kaydet)
  - Yukarı kaydırarak diğer fragmana geçiş (Opsiyonel)

### 2. 📚 Kitaplar Ekranı (Ana Katalog)
**Amacı:** Karakter bağımsız, klasik kitap okuma/seçme deneyimi. Çocuğun uygulamayı açtığında göreceği **varsayılan (güvenli) ekran** burasıdır.
- **Yapı:** Tematik kategorilere ayrılmış dikey kaydırmalı liste.
- **Ekranda Olanlar:**
  - Kategoriler: "Uyku Öncesi Masalları", "Maceraya Atıl", "Hayvanlar Alemi"
  - Yatay kaydırmalı kitap kapakları (Kapak resmi, başlık)
  - Tıklayınca -> **Hikaye Detay / Okuma Ekranı'na** gider.

### 3. 🦊 Karakterler Ekranı (Characters)
**Amacı:** Çocukların favori kahramanlarını seçip onların dünyasına girmesi.
- **Yapı:** Netflix "Profiller" veya "Kategoriler" ekranı gibi grid (ızgara) tasarımı.
- **Ekranda Olanlar:**
  - Üstte "Kiminle maceraya çıkmak istersin?" başlığı
  - 2 sütunlu büyük karakter kartları (Avatar resmi, "Tilki", "Baykuş" gibi isimler)
  - Tıklayınca -> **Karakter Detay Ekranı'na** gider.

#### ↳ 3.1. Karakter Detay Ekranı
- **Yapı:** Üstte karakterin büyük resmi ve bio'su, altta o karaktere ait hikayelerin yatay listesi (Netflix dizileri gibi).
- **Ekranda Olanlar:**
  - "Geri" butonu
  - Oynat butonu (İlk hikayeden başlatır)
  - Hikaye kartları (Kapak görseli, süre, okunma durumu)
  - Tıklayınca -> **Okuma/İzleme Ekranı'na** gider.

### 4. ❤️ Kitaplığım Ekranı (Library)
**Amacı:** Çocuğun daha önce beğendiği hikayeleri tekrar okuması ve çevrimdışı indirmeleri.
- **Yapı:** İki sekmeli (Tab) liste.
- **Ekranda Olanlar:**
  - Sekme 1: Favorilerim
  - Sekme 2: İndirilenler (İnternetsiz okunabilenler)
  - Hikaye kartları listesi

### 5. 📖 Klasik Okuma Ekranı (Story Player)
**Amacı:** Dinamik seçimlerin yapıldığı asıl okuma ekranı (Reels dışındaki ana mod).
- **Yapı:** Yatay veya dokunarak sayfa geçişli ekran.
- **Ekranda Olanlar:**
  - Üstte ilerleme çubuğu (Progress bar)
  - Ortada görsel/animasyon
  - Altta metin
  - Sahne sonunda: İki büyük karar butonu ("Ormana Git" - "Nehre Git")
  - Uyku modu tetiklendiğinde: Ekran yavaşça kararır, kontroller gizlenir.

### 6. 👨‍👩‍👧 Ebeveyn Ayarları (Settings / Parent Dashboard)
**Amacı:** Uygulama yönetiminin yapıldığı, çocuğun erişemeyeceği şifreli alan.
*(Ana sayfadaki sol üst gizli butondan girilir)*
- **Yapı:** Şifre ekranından sonra açılan standart ayarlar listesi.
- **Ekranda Olanlar:**
  - **Abonelik & Premium:** Freemium durum, abonelik iptal/satın alma
  - **Kısıtlamalar:** Günlük süre sınırı ayarlama (Örn: 30 dk)
  - **Filtreler:** Hassas kelimeleri kapatma (Canavar, korku vs.)
  - **Uyku Modu:** Otomatik kapanma zamanlayıcısı (Örn: 20:00'da uyku moduna geç)
  - **İstatistikler:** Çocuğun okuma süreleri grafiği

---

## 🧱 Uygulama İskeleti (Klasör Yapısı Planı)
Koda döktüğümüzde React (PWA) iskeletimiz şu şekilde olacak:

```text
src/
 ├── components/       (Tekrarlayan parçalar)
 │    ├── BottomNav    (Alt menü çubuğu)
 │    ├── StoryCard    (Karakter/Hikaye kartı)
 │    ├── VideoPlayer  (Reels oynatıcı)
 │    └── ParentGate   (Ebeveyn şifre ekranı)
 │
 ├── screens/          (Ana Sayfalar)
 │    ├── Feed         (Keşfet / Büyülü Kütüphane)
 │    ├── Books        (Kitaplar Kataloğu)
 │    ├── Characters   (Karakter Grid)
 │    ├── Library      (Kitaplık)
 │    ├── StoryDetail  (Okuma/Seçim ekranı)
 │    └── Settings     (Ebeveyn Paneli)
 │
 ├── context/          (Global Durum Yönetimi)
 │    ├── AudioContext (Ses kontrolü, uyku modu)
 │    └── UserContext  (Premium durumu, süre sınırı)
 │
 └── assets/           (İkonlar, sabit görseller)
```
