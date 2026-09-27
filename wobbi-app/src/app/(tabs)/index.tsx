import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Play, Heart, Moon, Sun, Sparkles, Clock, Compass, Star, User , ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/expo';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { STORY_BOOKS } from '@/data/books';

// Tema Kancaları
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'sleep', label: 'Uyku İçin', icon: Moon },
  { id: 'adventure', label: 'Macera', icon: Compass },
  { id: 'animals', label: 'Hayvanlar', icon: Heart },
  { id: 'fantasy', label: 'Fantastik', icon: Star },
];

export default function HomeScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  // Tema Durumu
  const { theme, autoSetTheme, setTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const isDay = theme === 'day';

  const [activeCategory, setActiveCategory] = useState('sleep');

  useEffect(() => {
    // Component yüklendiğinde saati kontrol edip temayı ayarla
    autoSetTheme();
  }, []);

  const heroBook = STORY_BOOKS[0]; 
  const popularBooks = STORY_BOOKS.slice(1, 3);
  const newBooks = STORY_BOOKS.slice(0, 2);

  // Tema Testi için geçici buton fonksiyonu
  const toggleTheme = () => {
    setTheme(isDay ? 'night' : 'day');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 140 }} 
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          
          {Platform.OS === 'android' ? (
            <View style={styles.header}>
              <TouchableOpacity style={[styles.avatarButton, { borderColor: colors.border, backgroundColor: isDay ? '#121322' : colors.cardBg }]}>
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}><User size={20} color="#FFFFFF" /></View>
                )}
              </TouchableOpacity>

              <View style={[styles.moshiBubble, { backgroundColor: isDay ? '#FFFFFF' : colors.cardBg, borderColor: colors.border }]}>
                <Text style={[styles.moshiBubbleText, { color: colors.text }]}>
                  Hey <Text style={{ fontFamily: 'Poppins_700Bold' }}>{user?.firstName || 'Leo'}</Text>
                </Text>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity style={[styles.iconButton, { borderColor: colors.border, backgroundColor: isDay ? '#121322' : colors.cardBg }]} onPress={toggleTheme}>
                  {isDay ? <Moon size={18} color="#FFFFFF" /> : <Sun size={18} color={colors.text} />}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { borderColor: colors.border, backgroundColor: isDay ? '#121322' : colors.cardBg }]}>
                  <Search size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.iosHeader}>
              <Text style={[styles.iosLogoText, { color: colors.text }]}>Wobbi</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity style={[styles.iconButton, { borderColor: colors.border }]} onPress={toggleTheme}>
                  {isDay ? <Moon size={20} color={colors.text} /> : <Sun size={20} color={colors.text} />}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { borderColor: colors.border }]}>
                  <Search size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.avatarButton, { borderColor: colors.border }]}>
                  <Image source={{ uri: user?.imageUrl || "https://www.gravatar.com/avatar/0?d=mp" }} style={styles.avatarImage} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Animated.View entering={FadeInDown.duration(600)} style={styles.greetingSection}>
            <Text style={[styles.greetingSub, { color: colors.textMuted }]}>
              {isDay ? "Günaydın," : "İyi akşamlar,"}
            </Text>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingName, { color: colors.text }]}>
                {user?.firstName || "Maceracı"}
              </Text>
              {isDay ? (
                <Sun size={28} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 8 }} />
              ) : (
                <Moon size={24} color="#FCD34D" fill="#FCD34D" style={{ marginLeft: 8 }} />
              )}
            </View>
            <Text style={[styles.greetingDesc, { color: colors.textMuted }]}>
              {isDay ? "Yeni bir maceraya hazır mısın? ☀️" : "Büyük rüyalar harika bir masalla başlar ✨"}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <TouchableOpacity 
                    key={cat.id} 
                    activeOpacity={0.8}
                    onPress={() => setActiveCategory(cat.id)}
                    style={[
                      styles.categoryPill, 
                      { borderColor: colors.border, backgroundColor: isDay ? '#FFF' : 'rgba(255,255,255,0.05)' },
                      isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                  >
                    <Icon size={14} color={isActive ? "#FFF" : colors.textMuted} />
                    <Text style={[
                      styles.categoryText, 
                      { color: colors.textMuted },
                      isActive && { color: '#FFF' }
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.heroSection}>
            <TouchableOpacity activeOpacity={0.9} style={[styles.heroCard, { borderColor: colors.border }]}>
              <ImageBackground source={heroBook?.coverImage} style={styles.heroImage} resizeMode="cover">
                <LinearGradient 
                  colors={['transparent', isDay ? 'rgba(240,249,255,0.8)' : 'rgba(18,19,34,0.4)', colors.background]} 
                  style={styles.heroGradient} 
                />
                <View style={styles.heroContent}>
                  <Text style={[styles.heroBadge, { color: isDay ? colors.primary : 'rgba(255,255,255,0.6)' }]}>Günün Masalı</Text>
                  <Text style={[styles.heroTitle, { color: colors.text }]}>{heroBook?.title || "Gizemli Vadi"}</Text>
                  <Text style={[styles.heroDesc, { color: colors.textMuted }]} numberOfLines={1}>Yıldızların altında huzurlu bir yolculuk...</Text>
                  
                  <View style={styles.heroMetaRow}>
                    <View style={[styles.metaBadge, { backgroundColor: isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)' }]}>
                      <Clock size={12} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.text }]}>8 dk</Text>
                    </View>
                    <View style={[styles.metaBadge, { backgroundColor: isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)' }]}>
                      <Sparkles size={12} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.text }]}>Sakinleştirici</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.heroPlayButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                  <Play size={20} color="#FFF" fill="#FFF" style={{ marginLeft: 2 }} />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.listSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Bu Gece Popüler</Text>
              <TouchableOpacity><Text style={[styles.seeAllText, { color: colors.textMuted }]}>Tümünü gör</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
              {popularBooks.map((book) => (
                <TouchableOpacity key={book.id} activeOpacity={0.8} style={styles.bookCard}>
                  <View style={[styles.cardImageContainer, { borderColor: colors.border }]}>
                    <Image source={book.coverImage} style={styles.cardImage} />
                    <View style={styles.cardHeart}>
                      <Heart size={14} color="#FFF" />
                    </View>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{book.title}</Text>
                  <View style={styles.cardMetaRow}>
                    <View style={[styles.cardMetaBadge, { borderColor: colors.border, backgroundColor: isDay ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.08)' }]}>
                      <Clock size={10} color={colors.textMuted} />
                      <Text style={[styles.cardMetaText, { color: colors.textMuted }]}>7 dk</Text>
                    </View>
                    <View style={[styles.cardMetaBadge, { borderColor: colors.border, backgroundColor: isDay ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.08)' }]}>
                      <Text style={[styles.cardMetaText, { color: colors.textMuted }]}>Macera</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 24,
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 24,
  },
  iosLogoText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    letterSpacing: 1,
  },
  moshiBubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  moshiBubbleText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 28,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
  },
  greetingDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  
  createBanner: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createBannerContent: {
    flex: 1,
  },
  createBannerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  createBannerDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  createBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  categoryText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroGradient: {
    position: 'absolute',
    left: 0, right: 0, top: '20%', bottom: 0,
  },
  heroContent: {
    padding: 20,
    zIndex: 2,
  },
  heroBadge: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  heroDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    marginBottom: 12,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  metaText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },
  heroPlayButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  listSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
  cardsScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  bookCard: {
    width: 150,
  },
  cardImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
  },
  cardMetaText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },
});
