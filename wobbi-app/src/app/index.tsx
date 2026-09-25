import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/expo';

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onSignInWithGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      alert("Test Modu: Giris basarisiz oldu veya Google yapilandirilmadi.");
    }
  }, []);

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'web' && styles.webContainer]} edges={['top', 'bottom']}>
      <View className="flex-1 px-6">
        {/* Logo header */}
        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Image source={images.mascotLogo} style={{ width: 40, height: 40 }} resizeMode="contain" />
          <Text className="font-poppins-semibold text-xl text-text-primary">
            wobbi
          </Text>
        </View>

        {/* Hero heading */}
        <Text className="font-poppins-bold text-[38px] text-text-primary leading-[44px] mt-8">
          {"Senin AI hikaye\n"}
          <Text className="text-lingua-purple">arkadasin.</Text>
        </Text>

        {/* Subtitle */}
        <Text className="font-poppins text-base text-text-secondary mt-3">
          Gercek konusmalar, kisisellestirilmis masallar, istedigin zaman, istedigin yerde.
        </Text>

        {/* Mascot illustration with speech bubbles */}
        <View className="flex-1 justify-center items-center my-6 relative">
          <Image
            source={images.mascotWelcome}
            style={{ width: 256, height: 256 }}
            resizeMode="contain"
          />

          <View className="absolute bg-white rounded-2xl px-4 py-2.5 left-2 top-[25%]" style={styles.shadow}>
            <Text className="font-poppins-medium text-sm text-text-primary">
              Merhaba!
            </Text>
          </View>

          <View className="absolute bg-white rounded-2xl px-4 py-2.5 right-2 top-[15%]" style={styles.shadow}>
            <Text className="font-poppins-medium text-sm text-text-primary">
              Nasilsin?
            </Text>
          </View>
        </View>

        {/* CTA button */}
        <TouchableOpacity
          className="bg-lingua-purple rounded-2xl flex-row items-center justify-center mt-2 mb-4 py-4"
          activeOpacity={0.85}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <Text className="font-poppins-semibold text-[17px] text-white">
            Basla
          </Text>
          <ChevronRight size={22} color="#fff" className="ml-2" />
        </TouchableOpacity>

        {/* Link to new onboarding screen */}
        <TouchableOpacity
          className="bg-gray-100 rounded-2xl flex-row items-center justify-center mb-6 py-4"
          activeOpacity={0.85}
          onPress={() => router.push('/onboarding')}
        >
          <Text className="font-poppins-semibold text-[17px] text-lingua-purple">
            View New Onboarding
          </Text>
          <ChevronRight size={22} color="#6C48FF" className="ml-2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
