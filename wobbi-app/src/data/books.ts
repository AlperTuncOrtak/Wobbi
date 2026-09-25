import { StoryBook } from "@/types/story";
import { images } from "@/constants/images";

export const STORY_BOOKS: StoryBook[] = [
  {
    id: "book_1",
    languageCode: "en",
    title: "Uzaylı Zumi",
    description: "Zumi Dünya'ya iniyor ve ilk kelimelerini öğreniyor.",
    coverImage: images.earth,
    difficultyLevel: "beginner",
    totalChapters: 3,
    category: "Öne Çıkanlar"
  },
  {
    id: "book_2",
    languageCode: "en",
    title: "Kayıp Hazine",
    description: "Eski bir harita, gizemli bir orman... Yön bulmayı keşfet.",
    coverImage: images.treasure,
    difficultyLevel: "intermediate",
    totalChapters: 5,
    category: "Maceraya Atıl"
  },
  {
    id: "book_3",
    languageCode: "en",
    title: "Gizemli Saray",
    description: "Eski bir şatoda geçen heyecanlı bir macera.",
    coverImage: images.palace,
    difficultyLevel: "beginner",
    totalChapters: 4,
    category: "Uyku Öncesi"
  },
  {
    id: "book_4",
    languageCode: "en",
    title: "Yıldız Tozu",
    description: "Gökyüzündeki yıldızların sırrını çöz.",
    coverImage: images.streakFire,
    difficultyLevel: "advanced",
    totalChapters: 6,
    category: "Uyku Öncesi"
  },
  {
    id: "book_5",
    languageCode: "en",
    title: "Sevimli Ejderha",
    description: "Ateş püskürtemeyen ejderha Puf'un hikayesi.",
    coverImage: images.mascotWelcome,
    difficultyLevel: "beginner",
    totalChapters: 2,
    category: "Maceraya Atıl"
  },
  {
    id: "book_6",
    languageCode: "en",
    title: "Tilki'nin Sırrı",
    description: "Ormanın en kurnaz tilkisi bu kez ne peşinde?",
    coverImage: images.mascotLogo,
    difficultyLevel: "intermediate",
    totalChapters: 4,
    category: "Öne Çıkanlar"
  }
];

export const getBooksByLanguage = (code: string) => {
  // Always return all books for the mock UI to look full and beautiful
  return STORY_BOOKS;
};
