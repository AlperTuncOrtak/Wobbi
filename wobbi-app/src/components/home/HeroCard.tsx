import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Play, Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

// Referanstaki "The Moon Whale" görseline benzer bir geçici görsel
const HERO_IMG = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80';

export default function HeroCard() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={[styles.card, { borderColor: colors.border, shadowColor: colors.primary }]}
        onPress={() => router.push('/book/book_1')}
      >
        <ImageBackground source={{ uri: HERO_IMG }} style={styles.image} resizeMode="cover">
          
          {/* Karanlık/Renk Geçişi Gradient */}
          <LinearGradient 
            colors={['transparent', 'rgba(0,0,0,0.1)', colors.background]} 
            style={StyleSheet.absoluteFillObject} 
          />

          <View style={styles.content}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>Günün Masalı</Text>
            <Text style={styles.title}>Uzaylı Zumi</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              Yıldızların altında huzurlu bir yolculuk...
            </Text>
            
            <View style={styles.metaRow}>
              <View style={[styles.metaBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Clock size={12} color="#FFFFFF" />
                <Text style={styles.metaText}>8 dk</Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Sparkles size={12} color="#FFFFFF" />
                <Text style={styles.metaText}>Sakinleştirici</Text>
              </View>
            </View>
          </View>

          <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
            <Play size={24} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
          </View>

        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    height: 300,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    // Hafif parlama efekti (özellikle gece modunda şık durur)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
    zIndex: 2,
  },
  badgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  metaText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  playButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }
});
