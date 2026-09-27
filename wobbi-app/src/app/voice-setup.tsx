import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mic, Square, CheckCircle, ChevronLeft, Volume2, Info } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

type RecordState = 'idle' | 'recording' | 'processing' | 'success';

export default function VoiceSetupScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [voiceId, setVoiceId] = useState<string | null>(null);

  const pulse = useSharedValue(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordState === 'recording') {
      pulse.value = withRepeat(
        withSequence(withTiming(1.3, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1, true
      );
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      pulse.value = withTiming(1);
    }
    return () => clearInterval(interval);
  }, [recordState]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1.5 - pulse.value,
  }));

  // ==========================================
  // SİMÜLASYON: MİKROFON İZNİ YOK, SADECE TİMER
  // ==========================================
  const startRecording = () => {
    setRecordState('recording');
    setSeconds(0);
  };

  const stopRecordingAndUpload = () => {
    setRecordState('processing');
    
    // Uygulama çökmemesi için gerçek ses dosyası yollamak yerine 
    // sistemin sorunsuz çalıştığını simüle ediyoruz.
    setTimeout(() => {
      setVoiceId("simulated_voice_xyz987");
      setRecordState('success');
    }, 2500);
  };

  const handleMicPress = () => {
    if (recordState === 'idle') startRecording();
    else if (recordState === 'recording') stopRecordingAndUpload();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border }]}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ses İkizi Oluştur</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInDown.delay(100)} style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <Info size={24} color={colors.primary} />
            </View>
            <View style={styles.infoTexts}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Sihirli Ses Klonlama</Text>
              <Text style={[styles.infoDesc, { color: colors.textMuted }]}>
                Aşağıdaki metni sessiz bir ortamda okuyarak sesinizi kaydedin. Yapay zeka sesinizi öğrenecek!
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={[styles.scriptCard, { borderColor: colors.border }]}>
            <Text style={[styles.scriptLabel, { color: colors.textMuted }]}>Lütfen sesli okuyun:</Text>
            <Text style={[styles.scriptText, { color: colors.text }]}>
              "Bir varmış, bir yokmuş... Uzak diyarlarda, yıldızların uyuduğu sihirli bir orman varmış. 
              Bu ormanda rüzgar ninniler söyler, ağaçlar çocuklara en güzel masalları fısıldarmış..."
            </Text>
          </Animated.View>

          <View style={styles.recordingSection}>
            {recordState === 'success' ? (
              <Animated.View entering={FadeIn} style={styles.successContainer}>
                <CheckCircle size={64} color="#10B981" />
                <Text style={[styles.successText, { color: colors.text }]}>Ses İkiziniz Hazır!</Text>
                {voiceId && <Text style={{color: colors.primary, marginBottom: 16}}>ID: {voiceId} (Simülasyon)</Text>}
                <Text style={[styles.successDesc, { color: colors.textMuted }]}>Artık masallar sizin sesinizle okunacak.</Text>
              </Animated.View>
            ) : (
              <>
                <Text style={[styles.timer, { color: recordState === 'recording' ? '#EF4444' : colors.text }]}>
                  {formatTime(seconds)} / 01:00
                </Text>

                <View style={styles.micWrapper}>
                  {recordState === 'recording' && <Animated.View style={[styles.pulseRing, { backgroundColor: '#EF4444' }, pulseStyle]} />}
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.micButton, { backgroundColor: recordState === 'recording' ? '#EF4444' : colors.primary }]}
                    onPress={handleMicPress}
                    disabled={recordState === 'processing'}
                  >
                    {recordState === 'recording' ? <Square size={32} color="#FFF" fill="#FFF" /> : <Mic size={32} color="#FFF" />}
                  </TouchableOpacity>
                </View>

                <Text style={[styles.statusText, { color: colors.textMuted }]}>
                  {recordState === 'idle' && "Kayda başlamak için mikrofona dokunun"}
                  {recordState === 'recording' && "Kaydı bitirmek için tekrar dokunun..."}
                  {recordState === 'processing' && "Yapay Zeka Sesinizi Klonluyor (Lütfen Bekleyin)..."}
                </Text>
              </>
            )}
          </View>
        </ScrollView>

        {recordState === 'success' && (
          <Animated.View entering={FadeInDown} style={styles.footer}>
            <Button title="Kaydet ve Kapat" variant="primary" onPress={() => router.back()} />
          </Animated.View>
        )}
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  infoCard: { flexDirection: 'row', padding: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoTexts: { flex: 1 },
  infoTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 4 },
  infoDesc: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 18 },
  scriptCard: { padding: 24, borderRadius: 24, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 40 },
  scriptLabel: { fontFamily: 'Poppins_500Medium', fontSize: 12, marginBottom: 12, textTransform: 'uppercase' },
  scriptText: { fontFamily: 'Poppins_500Medium', fontSize: 18, lineHeight: 30, fontStyle: 'italic' },
  recordingSection: { alignItems: 'center', justifyContent: 'center' },
  timer: { fontFamily: 'Poppins_700Bold', fontSize: 24, marginBottom: 32 },
  micWrapper: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  pulseRing: { position: 'absolute', width: 120, height: 120, borderRadius: 60 },
  micButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 10, zIndex: 2 },
  statusText: { fontFamily: 'Poppins_500Medium', fontSize: 14, textAlign: 'center' },
  successContainer: { alignItems: 'center' },
  successText: { fontFamily: 'Poppins_700Bold', fontSize: 24, marginTop: 16, marginBottom: 8 },
  successDesc: { fontFamily: 'Poppins_400Regular', fontSize: 14, textAlign: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 24 }
});
