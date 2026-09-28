import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Play, Heart, Moon, Sun, Clock, ChevronRight, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/expo';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { STORY_BOOKS } from '@/data/books';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Hero illüstrasyon URL'leri (Furkan'ın çizimleri gelene kadar)
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* ─── HERO BÖLÜMÜ ─── */}
        <View style={styles.heroSection}>
          {/* Arka plan illüstrasyonu */}
          <Image source={{ uri: HERO_BG }} style={styles.heroBg} resizeMode="cover" />
          
          {/* Üstten kararan gradient */}
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Header - üzerine bindirilmiş */}
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            {/* Avatar */}
            <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/(tabs)/profile')}>
              {user?.imageUrl
                ? <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
                : <View style={styles.avatarFallback}><User size={18} color="#FFF" /></View>
              }
            </TouchableOpacity>

            {/* Hey balonu */}
            <View style={styles.heyBubble}>
              <Text style={styles.heyText}>
                Hey <Text style={styles.heyBold}>{user?.firstName || 'Kahraman'}</Text>
              </Text>
            </View>

            {/* Sağ ikonlar */}
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setTheme(isDay ? 'night' : 'day')}>
                {isDay ? <Moon size={20} color="#FFF" /> : <Sun size={20} color="#FFF" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Search size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Maskot */}
          <Image source={{ uri: MASCOT_URL }} style={styles.mascot} resizeMode="contain" />

          {/* Öne çıkan masal küçük kartı */}
          <View style={styles.featuredChip}>
            <Image 
              source={STORY_BOOKS[0]?.coverImage} 
              style={styles.featuredChipImage} 
              resizeMode="cover"
            />
            <View style={styles.featuredChipInfo}>
              <Text style={styles.featuredChipLabel}>SleepyPaws önerir</Text>
              <Text style={styles.featuredChipTitle} numberOfLines={2}>
                {STORY_BOOKS[0]?.title}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── PROMO BANNER ─── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoSub, { color: colors.textMuted }]}>Rahatla ve keşfet</Text>
            <Text style={[styles.promoTitle, { color: colors.text }]}>3 ücretsiz gün kaldı</Text>
            <Text style={[styles.promoDesc, { color: colors.textMuted }]}>Devam etmek için abone ol</Text>
            <TouchableOpacity 
              style={[styles.promoBtn, { backgroundColor: '#0E1B2A' }]}
              onPress={() => router.push('/premium')}
            >
              <Text style={styles.promoBtnText}>Hemen Katıl</Text>
              <ChevronRight size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: PROMO_CHAR }} style={styles.promoChar} resizeMode="contain" />
        </Animated.View>

        {/* ─── KATEGORİLER ─── */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={[
                    styles.catPill,
                    { backgroundColor: isActive ? cat.color : colors.cardBg, borderColor: isActive ? cat.color : colors.border }
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

        {/* ─── MASAL YARAT BANNER ─── */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/create-story')}
            style={[styles.createBanner, { backgroundColor: '#6C4EF5' }]}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.createBannerTitle}>✨ Kendi Masalını Yarat</Text>
              <Text style={styles.createBannerDesc}>Yapay Zeka ile sihirli bir maceraya atıl</Text>
            </View>
            <ChevronRight size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* ─── POPÜLER MASALLAR ─── */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>En Popüler</Text>
            <TouchableOpacity><Text style={[styles.seeAll, { color: colors.textMuted }]}>Tümünü gör</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksScroll}>
            {popularBooks.map((book) => (
              <TouchableOpacity 
                key={book.id}
                style={styles.bookCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/book/${book.id}`)}
              >
                <View style={[styles.bookImageWrap, { borderColor: colors.border }]}>
                  <Image source={book.coverImage} style={styles.bookImage} resizeMode="cover" />
                  <TouchableOpacity style={styles.heartBtn}>
                    <Heart size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>{book.title}</Text>
                <View style={styles.bookMeta}>
                  <Clock size={11} color={colors.textMuted} />
                  <Text style={[styles.bookMetaText, { color: colors.textMuted }]}>7 dk</Text>
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
  heroSection: {
    width: '100%',
    height: 360,
    position: 'relative',
    marginBottom: 20,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  avatarButton: {
    width: 40, height: 40, borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarFallback: { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  heyBubble: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  heyText: { fontFamily: 'Poppins_500Medium', fontSize: 15, color: '#1E293B' },
  heyBold: { fontFamily: 'Poppins_700Bold' },
  headerRight: { flexDirection: 'row', gap: 10 },
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Maskot
  mascot: {
    position: 'absolute',
    left: 20,
    bottom: 60,
    width: 160,
    height: 160,
  },

  // Öne çıkan chip
  featuredChip: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 10,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  featuredChipImage: { width: 48, height: 48, borderRadius: 10, marginRight: 10 },
  featuredChipInfo: { flex: 1 },
  featuredChipLabel: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#64748B', marginBottom: 2 },
  featuredChipTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#1E293B' },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#E8F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  promoLeft: { flex: 1 },
  promoSub: { fontFamily: 'Poppins_400Regular', fontSize: 12, marginBottom: 2 },
  promoTitle: { fontFamily: 'Poppins_700Bold', fontSize: 18, marginBottom: 2 },
  promoDesc: { fontFamily: 'Poppins_400Regular', fontSize: 12, marginBottom: 12 },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 4,
  },
  promoBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: '#FFF' },
  promoChar: { width: 100, height: 100 },

  // Kategoriler
  catsScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  catPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  catText: { fontFamily: 'Poppins_500Medium', fontSize: 13 },

  // Masal Yarat Banner
  createBanner: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createBannerTitle: { fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFF', marginBottom: 2 },
  createBannerDesc: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)' },

  // Kitaplar
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 16,
  },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 18 },
  seeAll: { fontFamily: 'Poppins_500Medium', fontSize: 13 },
  booksScroll: { paddingHorizontal: 20, gap: 16, paddingBottom: 8 },
  bookCard: { width: 148 },
  bookImageWrap: {
    width: 148, height: 148,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 10,
  },
  bookImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  bookTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, marginBottom: 4 },
  bookMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookMetaText: { fontFamily: 'Poppins_400Regular', fontSize: 11 },
});
