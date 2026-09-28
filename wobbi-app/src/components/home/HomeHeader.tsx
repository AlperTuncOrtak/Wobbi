import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      
      {/* ── TOP NAV ── */}
      <View style={styles.topNav}>
        <Text style={[styles.logo, { color: colors.text }]}>Wobbi</Text>
        
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
    fontSize: 32,
    letterSpacing: 1,
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
