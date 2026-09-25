export type LanguageCode = "en" | "tr" | "es" | "fr" | "de" | "ja" | "ko" | "zh";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface VocabularyWord {
  id: string;
  word: string; // The word in the target language (e.g., "Hola")
  translation: string; // The translation in the user's native language (e.g., "Merhaba")
  pronunciation?: string; 
  contextExample?: string; // Example sentence from the story
}

export type SceneType = "narration" | "dialogue" | "ai_interaction" | "vocabulary_focus";

export interface StoryScene {
  id: string;
  type: SceneType;
  image?: any; // e.g., require('@/assets/images/scenes/zumi_lands.png')
  text: string; // The main story text or dialogue
  translation?: string; // Translated text
  speaker?: string; // If dialogue, who is speaking (e.g., "Zumi", "Narrator")
  highlightedVocabularyIds?: string[]; // IDs of words to highlight in this scene
  
  // For AI Mascot interactions (e.g. Fox asking the user a question)
  aiMascotPrompt?: {
    instruction: string; // e.g., "Ask the user to greet Zumi back."
    expectedUserInputType: "voice" | "text" | "choice";
    choices?: string[]; // If choice based
  };
}

export interface StoryChapter {
  id: string;
  bookId: string;
  order: number;
  title: string;
  description: string;
  xpReward: number;
  scenes: StoryScene[];
  vocabulary: VocabularyWord[]; // Words introduced in this chapter
}

export interface StoryBook {
  id: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  coverImage?: any; // The cover art
  difficultyLevel: DifficultyLevel;
  totalChapters: number;
  category?: string;
}
