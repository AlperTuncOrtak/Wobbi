import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bookmark, Pause, RotateCcw, RotateCw } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { STORY_BOOKS } from '@/data/books';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useDownloadStore } from '@/store/downloadStore';

const { width, height } = Dimensions.get('window');

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { theme } = useThemeStore();
  const { isDownloaded, downloadBook, deleteDownload, isDownloading } = useDownloadStore();
  const colors = Colors[theme];
  const isDay = theme === 'day';

  const [isPlaying, setIsPlaying] = useState(true);
  const book = STORY_BOOKS.find(b => b.id === id) || STORY_BOOKS[0];
  
  const isSaved = isDownloaded(book.id);
  const loading = isDownloading[book.id];

  const toggleSave = async () => {
    if (isSaved) {
      await deleteDownload(book.id);
    } else {
      // Gerçek projede book.coverImage URL olacaktır, test için sahte URL veriyoruz
      const fakeImageUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80";
      await downloadBook(book.id, fakeImageUrl);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <Image 
        source={book.coverImage} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={[isDay ? 'rgba(255,255,255,0.6)' : 'rgba(18,19,34,0.6)', 'transparent']}
        style={styles.topGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)', borderColor: colors.border }]} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.dotsContainer}>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.text }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)', borderColor: colors.border }]}
            onPress={toggleSave}
            activeOpacity={0.8}
          >
            <Bookmark size={20} color={isSaved ? "#FCD34D" : (loading ? colors.primary : colors.text)} fill={isSaved ? "#FCD34D" : "transparent"} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.duration(600).springify()} 
          style={[styles.readingPanel, { paddingBottom: insets.bottom || 24, borderColor: colors.border }]}
        >
          <BlurView 
            intensity={Platform.OS === 'ios' ? 60 : 100} 
            tint={isDay ? "light" : "dark"} 
            style={StyleSheet.absoluteFill as any}
          />
          <LinearGradient
            colors={isDay ? ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)'] : ['rgba(26, 27, 46, 0.7)', 'rgba(18, 19, 34, 1)']}
            style={StyleSheet.absoluteFill as any}
          />

          <View style={styles.panelContent}>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <Text style={[styles.chapterText, { color: colors.textMuted }]}>Bölüm 2 / 5</Text>
              <Text style={[styles.titleText, { color: colors.text }]}>{book.title}</Text>
              
              <Text style={[styles.storyText, { color: isDay ? colors.text : 'rgba(255,255,255,0.85)' }]}>
                Leo ve Fira nehri takip ettiler, gümüş renkli suları ay ışığı altında parlıyordu. 
                Yol onları her bir yaprağının anlatacak bir hikayesi varmış gibi görünen fısıldayan ağaçlarla dolu bir ormana götürdü.
              </Text>
              
              <Text style={[styles.quoteText, { color: colors.text }]}>
                "Bunu duyuyor musun?" diye fısıldadı Fira. Yumuşak, melodik bir ses yıldızlardan gelen bir şarkı gibi havada süzülüyordu.
              </Text>
            </ScrollView>

            <View style={[styles.playerContainer, { borderColor: colors.border }]}>
              
              <View style={styles.progressRow}>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>2:14</Text>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressBarFill, { width: '30%', backgroundColor: colors.primary }]} />
                  <View style={[styles.progressThumb, { left: '30%', backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>8:32</Text>
              </View>

              <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.skipButton}>
                  <RotateCcw size={24} color={colors.text} />
                  <Text style={[styles.skipText, { color: colors.text }]}>15</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.playPauseButton, { backgroundColor: isDay ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.1)' }]}
                  onPress={() => setIsPlaying(!isPlaying)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.playPauseInner, { backgroundColor: colors.primary }]}>
                    <Pause size={28} color="#FFF" fill="#FFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton}>
                  <RotateCw size={24} color={colors.text} />
                  <Text style={[styles.skipText, { color: colors.text }]}>15</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.65,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 120,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
  },
  readingPanel: {
    height: height * 0.55,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    borderTopWidth: 1,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  chapterText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  titleText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    marginBottom: 24,
  },
  storyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 20,
  },
  quoteText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  playerContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  timeText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    width: 32,
    textAlign: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6, 
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    position: 'absolute',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8,
    top: 9,
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
