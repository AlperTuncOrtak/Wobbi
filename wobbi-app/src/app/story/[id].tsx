import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getChaptersByBookId } from '@/data/chapters';
import { STORY_CHAPTERS } from '@/data/chapters';
import { colors, textStyles } from '@/constants/theme';
import { X, Play, Pause, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Find the chapter
  const chapter = STORY_CHAPTERS.find(c => c.id === id);
  const scenes = chapter?.scenes || [];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scene = scenes[currentSceneIndex];

  // Auto-play simulation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      // Simulate reading time based on text length (roughly 200ms per word)
      const words = scene?.text?.split(' ').length || 10;
      const readTime = Math.max(3000, words * 300);
      
      timer = setTimeout(() => {
        handleNext();
      }, readTime);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex]);

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      // End of chapter!
      alert('Bölüm bitti! Harika iş çıkardın.');
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  if (!chapter || scenes.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={textStyles.body}>Bu bölüm henüz hazır değil.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary.purple, fontWeight: 'bold' }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Image Background */}
      <View style={styles.imageContainer}>
        {scene.image && (
          <Image source={scene.image} style={styles.sceneImage} resizeMode="cover" />
        )}
        <View style={styles.imageOverlay} />
        
        {/* Close Button */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {scenes.map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.progressDot, 
                  idx === currentSceneIndex ? styles.progressDotActive : 
                  idx < currentSceneIndex ? styles.progressDotPassed : {}
                ]} 
              />
            ))}
          </View>
        </SafeAreaView>
      </View>

      {/* Bottom Text Panel */}
      <Animated.View entering={SlideInDown.duration(400)} style={styles.textPanel}>
        <View style={styles.textContent}>
          {scene.type === 'dialogue' && scene.speaker && (
            <View style={styles.speakerBadge}>
              <Text style={styles.speakerText}>{scene.speaker}</Text>
            </View>
          )}
          
          <Text style={styles.storyText}>
            {scene.text}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.navButton, currentSceneIndex === 0 && { opacity: 0.3 }]} 
            onPress={handlePrev}
            disabled={currentSceneIndex === 0}
          >
            <ChevronLeft size={32} color={colors.primary.purple} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause size={32} color="#fff" fill="#fff" />
            ) : (
              <Volume2 size={32} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <ChevronRight size={32} color={colors.primary.purple} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000', // Behind image
  },
  imageContainer: {
    flex: 1,
    width: '100%',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(0,0,0,0.15)', // Slight dark tint for readability
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginLeft: -40, // center offset due to close button
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  progressDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  progressDotPassed: {
    backgroundColor: '#fff',
  },
  textPanel: {
    backgroundColor: '#fff',
    height: height * 0.45,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  textContent: {
    flex: 1,
    marginTop: 10,
  },
  speakerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.purple + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  speakerText: {
    color: colors.primary.purple,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  storyText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 22,
    lineHeight: 32,
    color: colors.neutral.textPrimary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.purple + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
