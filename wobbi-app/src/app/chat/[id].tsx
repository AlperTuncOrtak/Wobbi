import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, Phone, Volume2, VolumeX, ChevronLeft, MoreVertical } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function VoiceChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const isDay = theme === 'day';

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Zumi / Avatar etrafında titreşim (Pulse) Animasyonu
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1, 
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1.5 - pulse.value,
  }));

  const character = {
    name: id === 'zumi' ? 'Zumi' : 'Bilge Baykuş',
    role: id === 'zumi' ? 'Uzaylı Dostun' : 'Ormanın Rehberi',
    // Avatarı biraz daha sevimli göstermek için dicebear kullanıyoruz
    image: `https://api.dicebear.com/7.x/bottts/png?seed=${id || 'zumi'}`, 
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* -- ÜST BÖLÜM -- */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.iconButton, { borderColor: colors.border }]} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Sesli Görüşme</Text>
            <Text style={[styles.headerStatus, { color: colors.primary }]}>Bağlı • 02:14</Text>
          </View>

          <TouchableOpacity style={[styles.iconButton, { borderColor: colors.border }]}>
            <MoreVertical size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* -- KARAKTER AVATARI -- */}
        <View style={styles.centerSection}>
          <View style={styles.avatarContainer}>
            <Animated.View style={[
              styles.pulseRing, 
              { backgroundColor: colors.primary },
              animatedPulseStyle
            ]} />
            <View style={[styles.avatarWrapper, { borderColor: colors.primary }]}>
              <Image source={{ uri: character.image }} style={styles.avatarImage} />
            </View>
          </View>
          
          <Animated.Text entering={FadeInDown.delay(200)} style={[styles.charName, { color: colors.text }]}>
            {character.name}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(300)} style={[styles.charRole, { color: colors.textMuted }]}>
            {character.role}
          </Animated.Text>
        </View>

        {/* -- ALT YAZILAR (GLASSMORPHISM) -- */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.subtitlesContainer}>
          <BlurView 
            intensity={isDay ? 40 : 20} 
            tint={isDay ? "light" : "dark"} 
            style={[styles.subtitlesGlass, { borderColor: colors.border, backgroundColor: colors.cardBg }]}
          >
            <Text style={[styles.subtitlesText, { color: colors.text }]}>
              "Merhaba Leo! Bugün yıldızların ötesinde harika bir macera bizi bekliyor. Hazır mısın?"
            </Text>
          </BlurView>
        </Animated.View>

        {/* -- ARAMA KONTROLLERİ -- */}
        <View style={styles.controlsSection}>
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { 
                backgroundColor: isMuted ? colors.primary : colors.cardBg, 
                borderColor: colors.border 
              }
            ]}
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} color="#FFF" /> : <Mic size={24} color={colors.text} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.hangupButton, { shadowColor: '#EF4444' }]}
            onPress={() => router.back()}
          >
            <Phone size={32} color="#FFF" fill="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { 
                backgroundColor: isSpeaker ? colors.primary : colors.cardBg, 
                borderColor: colors.border 
              }
            ]}
            onPress={() => setIsSpeaker(!isSpeaker)}
          >
            {isSpeaker ? <Volume2 size={24} color="#FFF" /> : <VolumeX size={24} color={colors.text} />}
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  headerStatus: { fontFamily: 'Poppins_500Medium', fontSize: 12 },
  
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  avatarContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    zIndex: 2,
  },
  avatarImage: { width: '100%', height: '100%' },
  charName: { fontFamily: 'Chewy_400Regular', fontSize: 36, marginBottom: 8 },
  charRole: { fontFamily: 'Poppins_500Medium', fontSize: 14 },
  
  subtitlesContainer: { 
    paddingHorizontal: 24, 
    marginTop: 'auto', 
    marginBottom: 40 
  },
  subtitlesGlass: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  subtitlesText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingBottom: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  hangupButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
