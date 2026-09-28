# WOBBI APP - AGENT INSTRUCTIONS

This document contains the core architectural and design rules for the Wobbi app. All AI agents working on this project MUST read and follow these rules.

## 1. Platform-Specific Design Rules (Android vs iOS)
The user explicitly wants the iOS and Android versions to look slightly different, reflecting their platform's native feel and specific mockups:
- **Android**: Uses a "Flat Bar" (edge-to-edge solid color, Moshi-style).
- **iOS**: Uses a "Floating Pill" transparent/glassmorphism TabBar.
*Note: Ensure `Platform.OS` checks are used when rendering TabBars or platform-specific headers to maintain this distinction.*

## 2. Theme System
Do NOT use Tailwind CSS / NativeWind. It has been removed.
All styling must be done using standard React Native `StyleSheet`.
The app uses a dynamic Day/Night theme system powered by Zustand (`@/store/themeStore`) and `Colors` object (`@/constants/theme`).
**Rule:** Always extract colors dynamically:
```tsx
const { theme } = useThemeStore();
const colors = Colors[theme] || Colors.day;
// Use colors.background, colors.text, colors.cardBg, colors.primary, etc.
```

## 3. Home Screen Structure
Based on the latest "Moon Whale" glassmorphic reference, the Home Screen (`index.tsx`) is built using a Component-by-Component methodology:
1. `HomeHeader` (Logo, Avatar, Theme/Search, Greeting)
2. `CategoryTabs` (Horizontal scrollable pills)
3. `HeroCard` (Large rounded featured story card with gradient overlay and play button)
4. `StoryLists` (Popular Tonight, New This Week - 2 column square cards)

## 4. Features & Integrations
- **ElevenLabs Voice Cloning:** Simulation mode only for now, located in `voice-setup.tsx`. Do NOT use `expo-av` native modules for recording as it crashes the Expo Go client.
- **Authentication:** Clerk is fully integrated. Frontend uses `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Offline Mode:** Uses `useDownloadStore` and `expo-file-system` to save files locally for the Library tab.
