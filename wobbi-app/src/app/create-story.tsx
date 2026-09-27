import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Sparkles, Rocket, Cat, Trees, Castle, Heart, Shield, Sun } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { SelectCard } from '@/components/ui/SelectCard';

// Dummy data (Furkan'ın çizimleri gelene kadar)
const HEROES = [
  { id: 'leo', title: 'Aslan Leo', icon: <Cat size={32} color="#F59E0B" /> },
  { id: 'zumi', title: 'Uzaylı Zumi', icon: <Rocket size={32} color="#8B5CF6" /> },
  { id: 'mia', title: 'Peri Mia', icon: <Sparkles size={32} color="#EC4899" /> },
];

const SETTINGS = [
  { id: 'forest', title: 'Büyülü Orman', icon: <Trees size={32} color="#10B981" /> },
  { id: 'space', title: 'Galaksi', icon: <Sun size={32} color="#F59E0B" /> },
  { id: 'castle', title: 'Eski Şato', icon: <Castle size={32} color="#64748B" /> },
];

const LESSONS = [
  { id: 'courage', title: 'Cesaret', icon: <Shield size={18} /> },
  { id: 'sharing', title: 'Paylaşmak', icon: <Heart size={18} /> },
  { id: 'friendship', title: 'Dostluk', icon: <Sparkles size={18} /> },
];

export default function CreateStoryScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;

  // Seçim Durumları
  const [hero, setHero] = useState<string | null>(null);
  const [setting, setSetting] = useState<string | null>(null);
  const [lesson, setLesson] = useState<string | null>(null);

  // Hepsi seçildi mi?
  const isReady = hero && setting && lesson;

  const handleGenerate = () => {
    if (!isReady) return;
    
    // Geçici olarak yükleniyor gibi gösterip, 
    // AI masal üretme sayfasına yönlendireceğiz
    router.push(`/story/generating?hero=${hero}&setting=${setting}&lesson=${lesson}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border }]}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Masal Yarat</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Adım 1: Kahraman */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Başrolde kim olsun?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {HEROES.map((h) => (
                <SelectCard
                  key={h.id}
                  title={h.title}
                  icon={h.icon}
                  selected={hero === h.id}
                  onPress={() => setHero(h.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Adım 2: Mekan */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Hikaye nerede geçsin?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {SETTINGS.map((s) => (
                <SelectCard
                  key={s.id}
                  title={s.title}
                  icon={s.icon}
                  selected={setting === s.id}
                  onPress={() => setSetting(s.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Adım 3: Ders / Ana Fikir */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Hangi dersi verelim?</Text>
            <View style={styles.chipContainer}>
              {LESSONS.map((l) => {
                const isSelected = lesson === l.id;
                return (
                  <TouchableOpacity
                    key={l.id}
                    activeOpacity={0.8}
                    onPress={() => setLesson(l.id)}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: isSelected ? colors.primary : colors.cardBg,
                        borderColor: isSelected ? colors.primary : colors.border
                      }
                    ]}
                  >
                    {React.cloneElement(l.icon as React.ReactElement, { color: isSelected ? '#FFF' : colors.textMuted })}
                    <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>
                      {l.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>

        {/* Alt Buton Alanı */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <Button 
            title={isReady ? "Sihri Başlat ✨" : "Lütfen seçimleri tamamla"}
            variant="primary"
            size="lg"
            disabled={!isReady}
            onPress={handleGenerate}
          />
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, marginBottom: 16 },
  iconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18 },
  scrollContent: { paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18, marginBottom: 16, paddingHorizontal: 24 },
  horizontalScroll: { paddingHorizontal: 24 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  chipText: { fontFamily: 'Poppins_500Medium', fontSize: 14 },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  }
});
