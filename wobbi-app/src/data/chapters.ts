import { StoryChapter } from "@/types/story";

export const STORY_CHAPTERS: StoryChapter[] = [
  // Uzaylı Zumi (book_1) - 3 Chapters
  {
    id: "c1_1",
    bookId: "book_1",
    order: 1,
    title: "Dünya'ya İniş",
    description: "Zumi uzay gemisinden iniyor ve yeni bir gezegenle tanışıyor.",
    xpReward: 50,
    scenes: [
  { id: "s1", type: "narration", text: "Zumi, pırıl pırıl parlayan uzay gemisiyle yavaşça ormana iniş yaptı. Burası onun gezegenine hiç benzemiyordu!", image: require("@/assets/images/earth.png") },
  { id: "s2", type: "dialogue", speaker: "Zumi", text: "Vay canına! Buradaki ağaçlar ne kadar da yeşil!", image: require("@/assets/images/mascot-welcome.png") },
  { id: "s3", type: "narration", text: "Birden çalıların arkasından küçük bir tavşan zıplayarak çıktı. Zumi hayatında ilk defa böyle tüylü bir canlı görüyordu.", image: require("@/assets/images/treasure.png") }
],
    vocabulary: []
  },
  {
    id: "c1_2",
    bookId: "book_1",
    order: 2,
    title: "İlk Arkadaş",
    description: "Zumi ormanda sevimli bir tavşanla karşılaşıyor.",
    xpReward: 60,
    scenes: [
  { id: "s1", type: "narration", text: "Zumi, pırıl pırıl parlayan uzay gemisiyle yavaşça ormana iniş yaptı. Burası onun gezegenine hiç benzemiyordu!", image: require("@/assets/images/earth.png") },
  { id: "s2", type: "dialogue", speaker: "Zumi", text: "Vay canına! Buradaki ağaçlar ne kadar da yeşil!", image: require("@/assets/images/mascot-welcome.png") },
  { id: "s3", type: "narration", text: "Birden çalıların arkasından küçük bir tavşan zıplayarak çıktı. Zumi hayatında ilk defa böyle tüylü bir canlı görüyordu.", image: require("@/assets/images/treasure.png") }
],
    vocabulary: []
  },
  {
    id: "c1_3",
    bookId: "book_1",
    order: 3,
    title: "Şehre Yolculuk",
    description: "Büyük ışıklı şehre doğru macera başlıyor.",
    xpReward: 100,
    scenes: [
  { id: "s1", type: "narration", text: "Zumi, pırıl pırıl parlayan uzay gemisiyle yavaşça ormana iniş yaptı. Burası onun gezegenine hiç benzemiyordu!", image: require("@/assets/images/earth.png") },
  { id: "s2", type: "dialogue", speaker: "Zumi", text: "Vay canına! Buradaki ağaçlar ne kadar da yeşil!", image: require("@/assets/images/mascot-welcome.png") },
  { id: "s3", type: "narration", text: "Birden çalıların arkasından küçük bir tavşan zıplayarak çıktı. Zumi hayatında ilk defa böyle tüylü bir canlı görüyordu.", image: require("@/assets/images/treasure.png") }
],
    vocabulary: []
  },
  // Kayıp Hazine (book_2)
  {
    id: "c2_1",
    bookId: "book_2",
    order: 1,
    title: "Eski Harita",
    description: "Tavan arasında bulunan gizemli haritanın sırrı.",
    xpReward: 50,
    scenes: [
  { id: "s1", type: "narration", text: "Zumi, pırıl pırıl parlayan uzay gemisiyle yavaşça ormana iniş yaptı. Burası onun gezegenine hiç benzemiyordu!", image: require("@/assets/images/earth.png") },
  { id: "s2", type: "dialogue", speaker: "Zumi", text: "Vay canına! Buradaki ağaçlar ne kadar da yeşil!", image: require("@/assets/images/mascot-welcome.png") },
  { id: "s3", type: "narration", text: "Birden çalıların arkasından küçük bir tavşan zıplayarak çıktı. Zumi hayatında ilk defa böyle tüylü bir canlı görüyordu.", image: require("@/assets/images/treasure.png") }
],
    vocabulary: []
  },
  {
    id: "c2_2",
    bookId: "book_2",
    order: 2,
    title: "Mağaranın Girişi",
    description: "Karanlık mağaraya adım atma vakti geldi.",
    xpReward: 70,
    scenes: [
  { id: "s1", type: "narration", text: "Zumi, pırıl pırıl parlayan uzay gemisiyle yavaşça ormana iniş yaptı. Burası onun gezegenine hiç benzemiyordu!", image: require("@/assets/images/earth.png") },
  { id: "s2", type: "dialogue", speaker: "Zumi", text: "Vay canına! Buradaki ağaçlar ne kadar da yeşil!", image: require("@/assets/images/mascot-welcome.png") },
  { id: "s3", type: "narration", text: "Birden çalıların arkasından küçük bir tavşan zıplayarak çıktı. Zumi hayatında ilk defa böyle tüylü bir canlı görüyordu.", image: require("@/assets/images/treasure.png") }
],
    vocabulary: []
  }
];

export const getChaptersByBookId = (bookId: string) => {
  return STORY_CHAPTERS.filter(c => c.bookId === bookId).sort((a, b) => a.order - b.order);
};
