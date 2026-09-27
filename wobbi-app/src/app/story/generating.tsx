import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

export default function GeneratingStoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;

  // Dönme Animasyonu
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Simülasyon: 4 saniye sonra oluşturulan masalın okunma sayfasına git
    // Gerçekte burada API çağrısı (fetch) yapılacak.
    const timer = setTimeout(() => {
      // Şimdilik test amaçlı rastgele bir masal ID'sine (örn: 1) yönlendiriyoruz
      // İleride API'den dönen gerçek ID olacak.
      router.replace('/story/1');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Sparkles size={64} color={colors.primary} />
        </Animated.View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          Sihir Gerçekleşiyor...
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Yapay zeka kahramanınız için eşsiz bir masal kaleme alıyor. Lütfen bekleyin.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  }
});
