import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'web' && styles.webContainer]} edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-8 pb-10">
        
        {/* Top Logo */}
        <View className="flex-row items-center justify-center">
          <Image source={images.moscotLogo} style={{ width: 48, height: 48 }} resizeMode="contain" />
          <Text className="font-poppins-semibold text-2xl text-text-primary ml-2">
            wobbi
          </Text>
        </View>

        {/* Text Section */}
        <View className="mt-8">
          <Text className="font-poppins-bold text-4xl text-text-primary leading-[44px]">
            Your AI language
          </Text>
          <Text className="font-poppins-bold text-4xl text-lingua-purple leading-[44px]">
            teacher.
          </Text>
          
          <Text className="font-poppins-regular text-base text-text-secondary mt-4 leading-6">
            Real conversations, personalized{'\n'}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot Image */}
        <View className="flex-1 justify-center items-center mt-6">
          <Image 
            source={images.mascotWelcome} 
            style={{ width: "100%", height: 320 }} 
            resizeMode="contain" 
          />
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="bg-lingua-purple rounded-2xl py-4 flex-row justify-center items-center mt-6"
          activeOpacity={0.85}
          onPress={() => router.push('/(auth)/sign-up')} 
        >
          <Text className="font-poppins-semibold text-white text-lg">Get Started</Text>
          <ChevronRight size={22} color="white" className="ml-2" />
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
});
