# Wobbi API (v1)

Backend ile mobil uygulama arasındaki sözleşme. Uç eklenir/değişirse önce bu dosya güncellenir.

- **Adres:** `http://130.61.17.158` (uygulamada `EXPO_PUBLIC_API_URL` olarak tutun)
  - Domain + HTTPS gelince sadece bu değişir. Android/iOS mağaza sürümleri düz HTTP'ye izin vermez, yayından önce HTTPS şart.
- **Hatalar:** Her hata `{ "hata": "Türkçe mesaj" }` döner. Mesaj kullanıcıya gösterilebilir.
- **Tarihler:** "Gün" Türkiye saatine göredir (limit ve seri gece 00:00'da döner).

## Giriş (Clerk)

🔒 işaretli uçlar Clerk oturum token'ı ister:

```ts
const { getToken } = useAuth();
const res = await fetch(`${API_URL}/api/stories/${id}`, {
  headers: { Authorization: `Bearer ${await getToken()}` },
});
```

Token yoksa/geçersizse `401`. Kullanıcı DB'de ilk istekte otomatik oluşur, ayrı kayıt ucu yok.

## Görsel ve ses adresleri

`cover_url`, `image_url`, `audio_url`, `avatar_url` **göreli** gelir (`/uploads/171...png`). Eski örnek veriler tam adres (`https://...`) olabilir:

```ts
const mediaUrl = (u?: string | null) => (!u ? undefined : u.startsWith('http') ? u : API_URL + u);
<Image source={{ uri: mediaUrl(story.cover_url) }} />
```

## Uçlar

| Metot | Adres | Giriş | Ne yapar |
|---|---|---|---|
| GET | `/api/stories` | – | Tüm hikayeler (kart bilgisi, sayfasız) |
| GET | `/api/stories/:id` | 🔒 | Hikaye + sayfalar. **Ücretsiz kullanıcının günlük hakkı burada düşer** |
| POST | `/api/user/finish-story` | 🔒 | Hikaye bitti → rozet kontrolü |
| GET | `/api/characters` | – | Karakterler + hikaye sayıları |
| GET | `/api/user/profile` | 🔒 | Premium durumu, istatistik, seri, rozetler |
| GET | `/api/user/favorites` | 🔒 | Favori hikayeler (en yeni önce) |
| PUT | `/api/user/favorites/:storyId` | 🔒 | Favoriye ekle → `204` |
| DELETE | `/api/user/favorites/:storyId` | 🔒 | Favoriden çıkar → `204` |

### Hikaye kartı — `GET /api/stories`, `GET /api/user/favorites`

```json
[{
  "id": 1,
  "title": "Tobi ve Kayıp Palamut",
  "description": "Tobi en sevdiği palamudunu kaybeder.",
  "category": "Macera",
  "cover_url": "/uploads/1790584431640-88229410.png",
  "duration_minutes": 4,
  "character_id": 1,
  "character_name": "Tilki Tobi",
  "theme_color": "#FF7F50",
  "page_count": 12
}]
```

Kategori sekmeleri ve karakter sayfası bu listeyi **uygulamada** filtreler (`category`, `character_id`). Boş alanlar `null` gelebilir.

### Hikaye + sayfalar — `GET /api/stories/:id` 🔒

Kart alanlarının hepsi + `pages`:

```json
{
  "id": 1, "title": "Tobi ve Kayıp Palamut", "...": "kart alanları",
  "pages": [{
    "id": 1,
    "page_number": 1,
    "image_url": "/uploads/...png",
    "audio_url": "/uploads/...mp3",
    "text_content": "Küçük tilki ormana doğru hızla koştu.",
    "word_timestamps": [{ "word": "Küçük", "start_time": 0.0, "end_time": 0.5 }],
    "magic_words": { "ormana": { "translation_en": "Forest", "audio_en": "forest.mp3" } }
  }]
}
```

- `word_timestamps`: karaoke. Ses çalarken `start_time <= konum < end_time` olan kelime vurgulanır.
- `magic_words`: kelimeye dokununca çeviri/ses. İkisi de `null` olabilir.
- **Ücretsiz kullanıcı** bugün *başka* bir hikaye açtıysa → `403`:
  ```json
  { "hata": "Günlük ücretsiz okuma limitine ulaştınız...", "limit_reached": true }
  ```
  → Premium ekranına yönlendirin. Bugün açtığı hikayeyi tekrar açmak hak yakmaz. Premium'da limit yok.
- Olmayan hikaye → `404`.

### Hikaye bitti — `POST /api/user/finish-story` 🔒

Son sayfa bitince çağrılır. Body: `{ "story_id": 1 }`

```json
{ "mesaj": "Hikaye tamamlandı.", "new_badges_earned": ["İlk Adım"] }
```

`new_badges_earned` boş değilse rozet kutlaması gösterin. Açılmamış hikaye için çağrılırsa bir şey olmaz.

### Karakterler — `GET /api/characters`

```json
[{ "id": 1, "name": "Tilki Tobi", "bio": "Ormanın en meraklı...", "avatar_url": "/uploads/...png", "theme_color": "#FF7F50", "story_count": 5 }]
```

Karaktere tıklanınca: `/api/stories` listesinden `character_id` eşleşenler.

### Profil — `GET /api/user/profile` 🔒

```json
{
  "id": 7,
  "email": "user_2x...@wobbi.local",
  "is_premium": false,
  "total_stories_read": 3,
  "streak_days": 2,
  "today_story_id": 1,
  "badges": [
    { "code": "FIRST_STEP", "name": "İlk Adım", "description": "...", "icon_url": "...", "earned_at": "2026-09-28T10:12:00.000Z" },
    { "code": "BOOKWORM", "name": "Kitap Kurdu", "description": "...", "icon_url": "...", "earned_at": null }
  ]
}
```

- `total_stories_read`: **bitirilen** farklı hikaye sayısı.
- `streak_days`: "Günlük Seri" — bugün veya dün biten, art arda hikaye açılan gün sayısı.
- `today_story_id`: bugün açılan ilk hikaye (yoksa `null`). Ücretsiz kullanıcıda **diğer kartlara kilit** göstermek için: `!is_premium && today_story_id && today_story_id !== story.id`.
- `badges`: katalogdaki **tüm** rozetler; `earned_at: null` = henüz kazanılmadı (kilitli göster).
- `email` şimdilik yer tutucu; gerçek e-posta Clerk'ten alınır.

## Çevrimdışı (İndirilenler)

İndir butonu: `GET /api/stories/:id` (hak düşer) → JSON'u AsyncStorage'a kaydet → `cover_url` ve her sayfanın `image_url`/`audio_url` dosyalarını indir. Çevrimdışı okumada API çağrılmaz; `finish-story` internet gelince gönderilir.

## Örnek veriden geçiş (Haluk)

| Uygulamada şimdi | API'de |
|---|---|
| `STORY_BOOKS` (`data/books.ts`) | `GET /api/stories` |
| `id: "book_1"` (string) | `id: 1` (sayı) |
| `coverImage` (require) | `cover_url` (göreli adres) |
| `totalChapters` | `page_count` |
| `STORY_CHAPTERS` / `scenes` | **yok** → `pages` (bölüm katmanı kaldırıldı; kitap detayında "Başla" doğrudan okumaya gider) |
| `difficultyLevel`, `languageCode` | **yok** (kaldırın ya da gizleyin) |
| Karakterler: sabit `CHARACTERS` | `GET /api/characters` |
| Favoriler: cihazda | `GET/PUT/DELETE /api/user/favorites` |

## Henüz yok

TR/EN çift dil, hikaye içi seçimler, uyku modu verisi (`NIGHT_OWL` rozeti), Premium satın alma (şimdilik `is_premium` DB'den elle), ödüllü reklam, karakterle AI sohbet (`/chat`).
