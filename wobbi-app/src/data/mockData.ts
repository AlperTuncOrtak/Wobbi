export const MOCK_CHARACTERS = [
  {
    id: 'char_1',
    name: 'Tilki Tobi',
    bio: 'Ormanın en meraklı ve zeki sakini. Yeni yerler keşfetmeye bayılır!',
    avatar_url: 'https://via.placeholder.com/300x300.png?text=Tilki+Tobi',
    theme_color: '#FF7F50',
    story_count: 5,
  },
  {
    id: 'char_2',
    name: 'Baykuş Bilge',
    bio: 'Geceleri ormanı aydınlatan bilgili ve sakin dostumuz.',
    avatar_url: 'https://via.placeholder.com/300x300.png?text=Baykus+Bilge',
    theme_color: '#6A5ACD',
    story_count: 3,
  },
];

export const MOCK_BOOKS = [
  {
    id: 'book_1',
    title: 'Tobi ve Kayıp Palamut',
    category: 'Macera',
    character_id: 'char_1',
    cover_url: 'https://via.placeholder.com/400x600.png?text=Kayıp+Palamut',
    duration_minutes: 4,
    description: 'Tobi kış hazırlığı yaparken en sevdiği palamudunu kaybeder. Onu bulmak için ormanın derinliklerine inmesi gerekecek.',
  },
  {
    id: 'book_2',
    title: 'Yıldızların Sırrı',
    category: 'Uyku Öncesi',
    character_id: 'char_2',
    cover_url: 'https://via.placeholder.com/400x600.png?text=Yildizlarin+Sirri',
    duration_minutes: 6,
    description: 'Baykuş Bilge yavru kuşlara gökyüzündeki yıldızların nasıl parladığını anlatıyor. Tam bir uyku masalı.',
  },
];

export const MOCK_STORY_DETAIL = {
  id: 'book_1',
  title: 'Tobi ve Kayıp Palamut',
  pages: [
    {
      page_number: 1,
      image_url: 'https://via.placeholder.com/800x800.png?text=Orman+Sahnesi',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Örnek ses
      text: 'Küçük tilki ormana doğru hızla koştu.',
      // Karaoke senkronizasyonu için her kelimenin saniye cinsinden başlama zamanı
      word_timestamps: [
        { word: 'Küçük', start_time: 0.0, end_time: 0.5 },
        { word: 'tilki', start_time: 0.6, end_time: 1.2 },
        { word: 'ormana', start_time: 1.3, end_time: 2.0 },
        { word: 'doğru', start_time: 2.1, end_time: 2.6 },
        { word: 'hızla', start_time: 2.7, end_time: 3.2 },
        { word: 'koştu.', start_time: 3.3, end_time: 4.0 },
      ],
      // MVP Eğitim Özelliği (Sihirli Kelimeler)
      magic_words: {
        'ormana': {
          translation_en: 'Forest',
          audio_en: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/forest--_gb_1.mp3'
        },
        'tilki': {
          translation_en: 'Fox',
          audio_en: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/fox--_gb_1.mp3'
        }
      }
    }
  ]
};
