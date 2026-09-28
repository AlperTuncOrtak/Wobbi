import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Play, Heart, Moon, Sun, Clock, ChevronRight, User, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/expo';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { STORY_BOOKS } from '@/data/books';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const HERO_BG = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80';
const MASCOT_URL = 'https://cdn3d.iconscout.com/3d/premium/thumb/koala-9973025-8148775.png';
const PROMO_CHAR = 'https://cdn3d.iconscout.com/3d/premium/thumb/bear-4716533-3917851.png';

const CATEGORIES = [
  { id: 'sleep', label: 'Uyku İçin', color: '#6C4EF5' },
  { id: 'adventure', label: 'Macera', color: '#F59E0B' },
  { id: 'animals', label: 'Hayvanlar', color: '#10B981' },
  { id: 'fantasy', label: 'Fantastik', color: '#EC4899' },
];

export default function HomeScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, autoSetTheme, setTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const isDay = theme === 'day';
  const [activeCategory, setActiveCategory] = useState('sleep');

  useEffect(() => { autoSetTheme(); }, []);

  const popularBooks = STORY_BOOKS.slice(0, 4);
  const featuredBook = STORY_BOOKS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── HERO BLOĞU ── */}
        <View style={[styles.heroBlock, { paddingTop: insets.top }]}>
          {/* Arka plan görseli */}
          <Image source={{ uri: HERO_BG }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          
          {/* Üst karartma */}
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.45)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* HEADER */}
          <View style={styles.header}>
            {/* Avatar */}
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
              {user?.imageUrl
                ? <Image source={{ uri: user.imageUrl }} style={styles.avatarImg} />
                : <User size={20} color="#FFF" />
              }
            </TouchableOpacity>

            {/* Hey Balonu */}
            <View style={styles.heyBubble}>
              <Text style={styles.heyText}>
                Hey <Text style={styles.heyBold}>{user?.firstName || 'Kahraman'}</Text>
              </Text>
            </View>

            {/* Sağ İkonlar */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setTheme(isDay ? 'night' : 'day')}>
                {isDay ? <Moon size={18} color="#FFF" /> : <Sun size={18} color="#FFF" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Search size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Maskot */}
          <Image source={{ uri: MASCOT_URL }} style={styles.mascot} resizeMode="contain" />

          {/* Öne çıkan masal kartı (sağ alt) */}
          <TouchableOpacity 
            style={styles.featuredChip}
            onPress={() => featuredBook && router.push(`/book/${featuredBook.id}`)}
          >
            <Image source={featuredBook?.coverImage} style={styles.featuredImg} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.featuredLabel}>Önerilen Masal</Text>
              <Text style={styles.featuredTitle} numberOfLines={2}>{featuredBook?.title}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── PROMO BANNER ── */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.promoBanner}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.promoSub, { color: colors.textMuted }]}>Rahatla ve keşfet</Text>
            <Text style={[styles.promoTitle, { color: colors.text }]}>3 ücretsiz gün kaldı</Text>
            <Text style={[styles.promoDesc, { color: colors.textMuted }]}>Devam etmek için abone ol</Text>
            <TouchableOpacity
              style={styles.promoBtn}
              onPress={() => router.push('/premium')}
            >
              <Text style={styles.promoBtnText}>Hemen Katıl</Text>
              <ChevronRight size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: PROMO_CHAR }} style={styles.promoChar} resizeMode="contain" />
        </Animated.View>

        {/* ── KATEGORİLER ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: isActive ? cat.color : colors.cardBg,
                      borderColor: isActive ? cat.color : colors.border,
                    }
                  ]}
                >
                  <Text style={[styles.catText, { color: isActive ? '#FFF' : colors.text }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── MASAL YARAT ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/create-story')}
            style={styles.createBanner}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.createTitle}>✨ Kendi Masalını Yarat</Text>
              <Text style={styles.createDesc}>Yapay Zeka ile sihirli bir maceraya atıl</Text>
            </View>
            <ChevronRight size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* ── EN POPÜLER ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>En Popüler</Text>
            <TouchableOpacity><Text style={[styles.seeAll, { color: colors.textMuted }]}>Tümünü gör</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksRow}>
            {popularBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/book/${book.id}`)}
              >
                <View style={[styles.bookImgWrap, { borderColor: colors.border }]}>
                  <Image source={book.coverImage} style={styles.bookImg} resizeMode="cover" />
                  <TouchableOpacity style={styles.heartBtn}>
                    <Heart size={13} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>{book.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} color={colors.textMuted} />
                  <Text style={[styles.bookDur, { color: colors.textMuted }]}>7 dk</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  heroBlock: {
    width: '100%',
    height: 380,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 10,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  heyBubble: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20, paddingVertical: 9,
    borderRadius: 24,
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
    elevation: 5,
  },
  heyText: { fontFamily: 'Poppins_500Medium', fontSize: 15, color: '#1E293B' },
  heyBold: { fontFamily: 'Poppins_700Bold' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },

  mascot: {
    position: 'absolute',
    left: 10,
    bottom: 50,
    width: 170, height: 170,
  },

  featuredChip: {
    position: 'absolute',
    right: 14, bottom: 14,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16, padding: 10,
    maxWidth: 190,
    shadowColor: '#000', shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    elevation: 6,
    gap: 10,
  },
  featuredImg: { width: 46, height: 46, borderRadius: 10 },
  featuredLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#64748B' },
  featuredTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#1E293B' },

  // Promo
  promoBanner: {
    margin: 20,
    borderRadius: 24,
    backgroundColor: '#DDF0F5',
    flexDirection: 'row', alignItems: 'center',
    padding: 20, overflow: 'hidden',
  },
  promoSub: { fontFamily: 'Poppins_400Regular', fontSize: 11, marginBottom: 2 },
  promoTitle: { fontFamily: 'Poppins_700Bold', fontSize: 17, marginBottom: 2 },
  promoDesc: { fontFamily: 'Poppins_400Regular', fontSize: 11, marginBottom: 14 },
  promoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#0E1B2A',
    alignSelf: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24,
  },
  promoBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: '#FFF' },
  promoChar: { width: 110, height: 110 },

  // Kategoriler
  catsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 20 },
  catPill: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1.5,
  },
  catText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13 },

  // Create Banner
  createBanner: {
    backgroundColor: '#6C4EF5',
    borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  createTitle: { fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFF', marginBottom: 2 },
  createDesc: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  // Kitaplar
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18 },
  seeAll: { fontFamily: 'Poppins_500Medium', fontSize: 13 },
  booksRow: { paddingHorizontal: 20, gap: 14 },
  bookCard: { width: 145 },
  bookImgWrap: {
    width: 145, height: 145, borderRadius: 20,
    overflow: 'hidden', borderWidth: 1, marginBottom: 10,
  },
  bookImg: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  bookTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 4 },
  bookDur: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
});
