import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeInDown,
  FadeIn,
  Easing
} from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Maskot Süzülme (Floating) Animasyonu
  const floatingY = useSharedValue(0);

  useEffect(() => {
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Sonsuz tekrar
      true // Geri dön
    );
  }, []);

  const animatedMascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingY.value }]
  }));

  return (
    <View style={styles.container}>
      {/* Büyülü Uzay Arka Planı */}
      <LinearGradient
        colors={['#0F1020', '#1A1C3A', '#2D224A']}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        
        {/* Üst Kısım: Logo ve Maskot */}
        <View style={styles.topSection}>
          <Animated.Text entering={FadeIn.delay(300).duration(1000)} style={styles.logo}>
            Wobbi
          </Animated.Text>
          
          <Animated.View style={[styles.mascotContainer, animatedMascotStyle]}>
            {/* Furkan'ın çizimleri gelene kadar geçici maskot */}
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/bottts/png?seed=zumi&backgroundColor=transparent' }} 
              style={styles.mascotImage} 
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Alt Kısım: Yazılar ve Butonlar */}
        <View style={styles.bottomSection}>
          <Animated.Text entering={FadeInDown.delay(500).duration(800)} style={styles.title}>
            Büyülü Bir Dünyaya Hazır mısın?
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(700).duration(800)} style={styles.subtitle}>
            Her gece senin seçtiğin kahramanlarla yepyeni ve sihirli uyku masalları yarat.
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(900).duration(800)} style={styles.buttonContainer}>
            <Button 
              title="Maceraya Başla" 
              size="lg" 
              variant="primary"
              onPress={() => router.push('/(tabs)')}
            />
            <Button 
              title="Giriş Yap" 
              size="lg" 
              variant="ghost"
              style={{ marginTop: 12 }}
              onPress={() => router.push('/(auth)/sign-in')}
            />
          </Animated.View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  
  topSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 40,
  },
  mascotContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7D67FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#A0A3BD',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  }
});
