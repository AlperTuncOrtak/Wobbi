import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, useEffect } from 'react-native-reanimated';

interface SelectCardProps {
  title: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  selected: boolean;
  onPress: () => void;
  style?: any;
}

export function SelectCard({ title, icon, imageUrl, selected, onPress, style }: SelectCardProps) {
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;

  const scale = useSharedValue(1);

  // Seçilme animasyonu
  React.useEffect(() => {
    scale.value = withTiming(selected ? 1.05 : 1, { duration: 200 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: selected ? colors.primary : colors.border,
    backgroundColor: selected ? (colors.primary + '15') : colors.cardBg, // %15 opacity tint
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Seçili İkonu (Tik) */}
        {selected && (
          <View style={styles.checkBadge}>
            <CheckCircle2 size={16} color={colors.primary} fill="#FFF" />
          </View>
        )}

        {/* Görsel veya İkon */}
        <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            icon
          )}
        </View>

        {/* Başlık */}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    marginRight: 12,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    textAlign: 'center',
  },
});
