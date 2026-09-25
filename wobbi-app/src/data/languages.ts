import { LanguageCode } from "@/types/story";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  learners: string;
}

export const LANGUAGES: Language[] = [
  {
    code: "en",
    name: "İngilizce",
    nativeName: "English",
    flag: "https://flagcdn.com/w320/gb.png",
    color: "#4D88FF",
    learners: "120M",
  },
  {
    code: "tr",
    name: "Türkçe",
    nativeName: "Türkçe",
    flag: "https://flagcdn.com/w320/tr.png",
    color: "#E30A17",
    learners: "5M",
  },
  {
    code: "es",
    name: "İspanyolca",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    color: "#FF9500",
    learners: "28.4M",
  },
  {
    code: "fr",
    name: "Fransızca",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    color: "#4D88FF",
    learners: "19.4M",
  },
  {
    code: "de",
    name: "Almanca",
    nativeName: "Deutsch",
    flag: "https://flagcdn.com/w320/de.png",
    color: "#FFCC00",
    learners: "8.1M",
  },
  {
    code: "ja",
    name: "Japonca",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    color: "#FF3B30",
    learners: "12.7M",
  }
];
