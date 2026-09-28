import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Settings, Flame, Star, BookOpen, Crown, ChevronRight, Mic, 
  Globe, Clock, Shield, HelpCircle, Mail, FileText, Lock 
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const isDay = theme === 'day';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <TouchableOpacity style={styles.iconButton}>
            <Settings size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Animated.View entering={FadeInDown.duration(600)} style={styles.profileSection}>
            <View style={[styles.avatarGlow, { backgroundColor: isDay ? 'rgba(14, 165, 233, 0.1)' : 'rgba(125, 103, 255, 0.2)', borderColor: isDay ? 'rgba(14, 165, 233, 0.3)' : 'rgba(125, 103, 255, 0.4)' }]}>
              <Image 
                source={{ uri: user?.imageUrl || "https://www.gravatar.com/avatar/0?d=mp" }} 
                style={styles.avatarImage} 
              />
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.firstName || "Leo"}</Text>
            <Text style={[styles.userTags, { color: colors.textMuted }]}>Hayalperest - Kaşif - Nazik</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Flame size={24} color="#FF6B6B" fill="#FF6B6B" style={{ opacity: 0.8 }} />
              <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Günlük Seri</Text>
            </View>
            
            <View style={[styles.statBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Star size={24} color="#FCD34D" fill="#FCD34D" style={{ opacity: 0.8 }} />
              <Text style={[styles.statNumber, { color: colors.text }]}>842</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Yıldız Tozu</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <BookOpen size={24} color="#63ECD0" />
              <Text style={[styles.statNumber, { color: colors.text }]}>28</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Okunan Kitap</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.premiumContainer}>
            <TouchableOpacity activeOpacity={0.9} style={[styles.premiumCard, { borderColor: isDay ? 'rgba(14, 165, 233, 0.3)' : 'rgba(125, 103, 255, 0.4)' }]} onPress={() => router.push('/premium')}>
              <LinearGradient
                colors={isDay ? ['rgba(14, 165, 233, 0.1)', 'rgba(14, 165, 233, 0.02)'] : ['rgba(125, 103, 255, 0.2)', 'rgba(125, 103, 255, 0.05)']}
                style={StyleSheet.absoluteFill as any}
              />
              <View style={styles.premiumContent}>
                <View style={[styles.crownContainer, { backgroundColor: isDay ? 'rgba(252, 211, 77, 0.2)' : 'rgba(252, 211, 77, 0.1)' }]}>
                  <Crown size={22} color="#F59E0B" fill="#F59E0B" />
                </View>
                <View style={styles.premiumTexts}>
                  <Text style={[styles.premiumTitle, { color: colors.text }]}>Wobbi Premium</Text>
                  <Text style={[styles.premiumDesc, { color: colors.textMuted }]}>Daha fazla masal, karakter ve sihirli özelliklerin kilidini açın.</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <Globe size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Dil (Language)</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.textMuted }]}>Türkçe</Text>
                <ChevronRight size={18} color={colors.border} />
              </View>
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <Clock size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Uyku Hatırlatıcısı</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.textMuted }]}>20:30</Text>
                <ChevronRight size={18} color={colors.border} />
              </View>
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/voice-setup')}>
              <View style={styles.rowLeft}>
                <View style={[styles.voiceIconWrap, { backgroundColor: colors.primary + '20' }]}>
                  <Mic size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.rowText, { color: colors.text }]}>Ses İkizi Oluştur</Text>
                  <Text style={[styles.rowSubtext, { color: colors.textMuted }]}>ElevenLabs ile kendi sesini klonla</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.primary} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <Shield size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Ebeveyn Kilidi</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: colors.textMuted }]}>Aktif</Text>
                <ChevronRight size={18} color={colors.border} />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.settingsGroup}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>Destek & Hakkında</Text>
            
            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <HelpCircle size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Yardım & SSS</Text>
              </View>
              <ChevronRight size={18} color={colors.border} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <Mail size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Bize Ulaşın</Text>
              </View>
              <ChevronRight size={18} color={colors.border} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <FileText size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Kullanım Şartları</Text>
              </View>
              <ChevronRight size={18} color={colors.border} />
            </TouchableOpacity>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <Lock size={20} color={colors.textMuted} />
                <Text style={[styles.rowText, { color: colors.text }]}>Gizlilik Politikası</Text>
              </View>
              <ChevronRight size={18} color={colors.border} />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.2)' }]} onPress={() => signOut()}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  avatarGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  userTags: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginTop: 12,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
  },
  premiumContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  premiumCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  crownContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumTexts: {
    flex: 1,
  },
  premiumTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  premiumDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    lineHeight: 16,
    paddingRight: 10,
  },
  settingsGroup: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  groupTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  voiceIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 4,
  },
  rowSubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  rowText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  separator: {
    height: 1,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FF6B6B',
  },
});
