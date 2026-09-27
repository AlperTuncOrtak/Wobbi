import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CHARACTERS = [
  { id: 'zumi', name: 'Zumi', role: 'Uzaylı Dostun', color: '#7D67FF' },
  { id: 'bilge', name: 'Bilge Baykuş', role: 'Ormanın Rehberi', color: '#63ECD0' },
  { id: 'fira', name: 'Fira', role: 'Ateş Perisi', color: '#FF6B6B' },
];

export default function CharactersScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const isDay = theme === 'day';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Karakterler</Text>
          <Text style={[styles.headerDesc, { color: colors.textMuted }]}>
            En sevdiğin masal kahramanlarıyla sesli sohbet et!
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {CHARACTERS.map((char, index) => (
            <Animated.View key={char.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                onPress={() => router.push(`/chat/${char.id}`)}
              >
                <View style={[styles.avatarContainer, { borderColor: char.color }]}>
                  <Image 
                    source={{ uri: `https://api.dicebear.com/7.x/bottts/png?seed=${char.id}` }} 
                    style={styles.avatarImage} 
                  />
                </View>
                
                <View style={styles.cardInfo}>
                  <Text style={[styles.charName, { color: colors.text }]}>{char.name}</Text>
                  <Text style={[styles.charRole, { color: colors.textMuted }]}>{char.role}</Text>
                </View>

                <View style={[styles.callButton, { backgroundColor: char.color }]}>
                  <Phone size={20} color="#FFF" fill="#FFF" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    marginBottom: 8,
  },
  headerDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
  },
  charName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  charRole: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
});
