import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList, ImageBackground, Image, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { useLanguageStore } from '@/store/languageStore';
import { usePostHog } from 'posthog-react-native';
import { getBooksByLanguage } from '@/data/books';
import { LANGUAGES } from '@/data/languages';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Bookmark, Play, Lock } from 'lucide-react-native';
import { colors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Estimate bottom tab bar height to adjust item size
const TAB_BAR_HEIGHT = 64; 

export default function HomeScreen() {
  const { user } = useUser();
  const { selectedLanguage } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const posthog = usePostHog();

  // 1. Get user info
  const firstName = user?.firstName || "Gezgin";

  // 2. Get language info
  const languageData = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];
  
  // 3. Get relevant books (Reels content)
  const books = getBooksByLanguage(languageData.code);

  const ITEM_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT - (Platform.OS === 'android' ? 24 : 0);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={{ width: SCREEN_WIDTH, height: ITEM_HEIGHT }}>
        <ImageBackground 
          source={item.coverImage} 
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        >
          {/* Gradient for text readability at the bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          <View style={styles.contentContainer}>
            {/* Main Text Content */}
            <View style={styles.textContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              
              <TouchableOpacity style={styles.playButton} activeOpacity={0.8} onPress={() => posthog?.capture('story_completed', { story_name: item.title })}>
                <Play size={20} color="#fff" fill="#fff" />
                <Text style={styles.playText}>Hikayeye Başla</Text>
              </TouchableOpacity>
            </View>

            {/* Right Side Actions (Reels style) */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.iconCircle}>
                  <Heart size={24} color="#fff" />
                </View>
                <Text style={styles.actionText}>Beğen</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.iconCircle}>
                  <Bookmark size={24} color="#fff" />
                </View>
                <Text style={styles.actionText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 4. The Reels Feed */}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        bounces={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* 5. Floating Header (User info & Language) */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.lockCircle}>
              <Lock size={16} color="#fff" />
            </View>
            <Text style={styles.welcomeText}>Merhaba, {firstName}</Text>
          </View>

          {/* Language Flag Badge */}
          <View style={styles.languageBadge}>
            <Image source={{ uri: languageData.flag }} style={styles.flagIcon} />
            <Text style={styles.languageText}>{languageData.name}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  welcomeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  flagIcon: {
    width: 20,
    height: 15,
    borderRadius: 2,
    marginRight: 6,
  },
  languageText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#fff',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.purple,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  playText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#fff',
    marginLeft: 8,
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#fff',
  }
});
