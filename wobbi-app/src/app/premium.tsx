import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, Check } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

export default function PremiumScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;

  const features = [
    'Sınırsız AI masal üretimi',
    'Ses İkizi klonlama (ElevenLabs)',
    'Tüm karakterlere sesli erişim',
    'Offline mod - internet olmadan dinle',
    'HD ses kalitesi',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Crown size={48} color="#F59E0B" fill="#F59E0B" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Wobbi Premium</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Tüm büyülü özelliklerin kilidini açın
          </Text>

          <View style={styles.featureList}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Check size={20} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>{f}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryBtnText}>₺49.99 / ay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.cancelText, { color: colors.textMuted }]}>Şimdi değil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  closeBtn: { alignSelf: 'flex-end', padding: 24, paddingBottom: 0 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 28, marginBottom: 8 },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  featureList: { width: '100%', marginBottom: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  featureText: { fontFamily: 'Poppins_500Medium', fontSize: 16 },
  primaryBtn: { width: '100%', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  primaryBtnText: { fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#FFFFFF' },
  cancelText: { fontFamily: 'Poppins_500Medium', fontSize: 14 },
});
