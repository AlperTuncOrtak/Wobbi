import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mic, PhoneOff, Type, Volume2, Sparkles } from 'lucide-react-native';
import { colors, textStyles } from '@/constants/theme';
import { images } from '@/constants/images';
import { usePostHog } from 'posthog-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useRef } from 'react';

const { width, height } = Dimensions.get('window');

export default function VoiceChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const posthog = usePostHog();
  const { selectedLanguage } = useLanguageStore();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    posthog?.capture('lesson_started', {
      lesson_id: id,
      language: selectedLanguage,
      lesson_number: 1,
    });

    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      posthog?.capture('lesson_abandoned', {
        lesson_id: id,
        time_into_lesson_seconds: timeSpent,
        last_question_index: 0,
      });
    };
  }, []);
  
  // Mock states for the UI
  const [isListening, setIsListening] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [callTimer, setCallTimer] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.timerBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.timerText}>{formatTime(callTimer)}</Text>
        </View>
        <Text style={styles.characterName}>Uzaylı Zumi</Text>
        <Text style={styles.languageText}>İspanyolca Pratik</Text>
      </View>

      {/* Mission / Goal Bubble */}
      <View style={styles.missionContainer}>
        <Sparkles size={16} color={colors.primary.purple} style={{ marginRight: 6 }} />
        <Text style={styles.missionText}>Görev: Zumi'ye "Hola" (Merhaba) de!</Text>
      </View>

      {/* Center Mascot (Teacher Placeholder) */}
      <View style={styles.mascotContainer}>
        <View style={[styles.mascotGlow, isListening && styles.mascotGlowActive]} />
        <Image 
          source={images.mascotWelcome} 
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>

      {/* Chat Bubbles / Subtitles */}
      <View style={styles.subtitlesContainer}>
        {showSubtitles && (
          <>
            {/* Zumi's speech bubble */}
            <View style={styles.bubbleZumi}>
              <Text style={styles.bubbleZumiText}>¡Hola! ¿Eres mi nuevo amigo?</Text>
              <Text style={styles.bubbleZumiTranslation}>(Merhaba! Sen benim yeni arkadaşım mısın?)</Text>
            </View>

            {/* User's speech bubble (if listening/speaking) */}
            <View style={[styles.bubbleUser, { opacity: isListening ? 1 : 0.4 }]}>
              <Text style={styles.bubbleUserText}>
                {isListening ? "Dinleniyor..." : "Konuşmak için mikrofona bas..."}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        {/* Subtitles Toggle */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setShowSubtitles(!showSubtitles)}
        >
          <Type size={24} color="#fff" />
        </TouchableOpacity>

        {/* Main Microphone Button */}
        <TouchableOpacity 
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPressIn={() => setIsListening(true)}
          onPressOut={() => setIsListening(false)}
          activeOpacity={0.9}
        >
          <Mic size={40} color="#fff" />
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: '#ef4444' }]}
          onPress={() => router.back()}
        >
          <PhoneOff size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark blue/night background for focus
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  timerText: {
    ...textStyles.caption,
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  characterName: {
    ...textStyles.h2,
    color: '#fff',
  },
  languageText: {
    ...textStyles.body,
    color: '#94a3b8',
  },
  missionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 78, 245, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(108, 78, 245, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  missionText: {
    ...textStyles.button,
    color: '#c4b5fd',
  },
  mascotContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(108, 78, 245, 0.15)',
    transform: [{ scale: 1 }],
  },
  mascotGlowActive: {
    backgroundColor: 'rgba(108, 78, 245, 0.4)',
    transform: [{ scale: 1.2 }],
  },
  mascotImage: {
    width: 200,
    height: 200,
    zIndex: 10,
  },
  subtitlesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    minHeight: 120,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  bubbleZumi: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  bubbleZumiText: {
    ...textStyles.body,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  bubbleZumiTranslation: {
    ...textStyles.caption,
    color: '#64748b',
    fontStyle: 'italic',
  },
  bubbleUser: {
    backgroundColor: colors.primary.purple,
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  bubbleUserText: {
    ...textStyles.body,
    color: '#ffffff',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  micButtonActive: {
    backgroundColor: '#ef4444', // Red when recording
    borderColor: 'rgba(239, 68, 68, 0.4)',
    transform: [{ scale: 1.1 }],
  }
});
