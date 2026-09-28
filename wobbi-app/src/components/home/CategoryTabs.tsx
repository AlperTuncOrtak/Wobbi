import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Moon, Compass, Heart, Star } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'sleep', label: 'Uyku İçin', icon: Moon },
  { id: 'adventure', label: 'Macera', icon: Compass },
  { id: 'animals', label: 'Hayvanlar', icon: Heart },
  { id: 'fantasy', label: 'Fantastik', icon: Star },
];

interface CategoryTabsProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;
  const isDay = theme === 'day';

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(600)}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          
          return (
            <TouchableOpacity 
              key={cat.id} 
              activeOpacity={0.8}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.pill, 
                { 
                  backgroundColor: isActive ? colors.primary : (isDay ? '#FFFFFF' : colors.cardBg),
                  borderColor: isActive ? colors.primary : colors.border
                }
              ]}
            >
              <Icon size={16} color={isActive ? "#FFFFFF" : colors.textMuted} />
              <Text style={[
                styles.label, 
                { color: isActive ? '#FFFFFF' : colors.textMuted }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  }
});
