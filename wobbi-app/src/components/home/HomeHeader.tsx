import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Moon, Sun } from 'lucide-react-native';
import { useUser } from '@clerk/expo';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function HomeHeader() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;
  const isDay = theme === 'day';

  // ANDROID: Avatar Solda, Konuşma Balonu Ortada, Arama Sağda
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 16, marginBottom: 16 }]}>
        <View style={styles.androidTopNav}>
          {/* Avatar (Sol) */}
          <TouchableOpacity 
            style={styles.androidAvatarBtn}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.androidAvatarFallback} />
            )}
          </TouchableOpacity>

          {/* Konuşma Balonu (Orta) */}
          <View style={styles.bubbleContainer}>
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>
                Hey <Text style={styles.bubbleTextBold}>{user?.firstName || 'Wulfa'}</Text>
              </Text>
            </View>
            <View style={styles.bubbleTail} />
          </View>

          {/* İkonlar (Sağ) */}
          <View style={styles.rightIcons}>
             <TouchableOpacity style={styles.androidIconBtn} onPress={() => setTheme(isDay ? 'night' : 'day')}>
               {isDay ? <Moon size={20} color="#FFF" /> : <Sun size={20} color="#FFF" />}
             </TouchableOpacity>
             <TouchableOpacity style={styles.androidIconBtn}>
               <Search size={20} color="#FFF" />
             </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // IOS: Orijinal Tasarım (Wobbi Logosu, Greeting)
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      
      {/* ── TOP NAV ── */}
      <View style={styles.topNav}>
        <Text style={[styles.logo, { color: isDay ? colors.primary : colors.text }]}>Wobbi</Text>
        
        <View style={styles.rightIcons}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)' }]}>
            <Search size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.avatarBtn, { borderColor: isDay ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── GREETING ── */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.greetingSection}>
        <Text style={[styles.greetingSub, { color: colors.textMuted }]}>
          {isDay ? 'Good morning,' : 'Good evening,'}
        </Text>
        <View style={styles.nameRow}>
          <Text style={[styles.greetingName, { color: colors.text }]}>
            {user?.firstName || 'Leo'}
          </Text>
          {isDay ? (
            <TouchableOpacity onPress={() => setTheme("night")}><Sun size={26} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 8 }} /></TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setTheme("day")}><Moon size={26} color="#FCD34D" fill="#FCD34D" style={{ marginLeft: 8 }} /></TouchableOpacity>
          )}
        </View>
        <Text style={[styles.greetingDesc, { color: colors.textMuted }]}>
          Big dreams start with a great story ✨
        </Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  androidTopNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  androidAvatarBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0F1020',
    backgroundColor: '#0F1020',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  androidAvatarFallback: {
    width: '100%', height: '100%',
    backgroundColor: '#0F1020',
  },
  androidIconBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: '#0F1020',
    justifyContent: 'center', alignItems: 'center',
  },
  bubbleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#0F1020',
  },
  bubbleTextBold: {
    fontFamily: 'Poppins_700Bold',
  },
  bubbleTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -1,
  },

  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%', height: '100%',
  },
  avatarFallback: {
    width: '100%', height: '100%',
  },
  greetingSection: {
    //
  },
  greetingSub: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    lineHeight: 44,
  },
  greetingDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  }
});
