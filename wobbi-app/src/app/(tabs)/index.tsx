import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';

// Bileşenlerimiz
import HomeHeader from '@/components/home/HomeHeader';
import CategoryTabs from '@/components/home/CategoryTabs';
import HeroCard from '@/components/home/HeroCard';

export default function HomeScreen() {
  const { theme, autoSetTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;
  
  const [activeCategory, setActiveCategory] = useState('sleep');

  useEffect(() => { autoSetTheme(); }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme === 'day' ? 'dark-content' : 'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Adım 1: Header & Greeting */}
        <HomeHeader />

        {/* Adım 2: Kategori Hapları */}
        <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* Adım 3: Büyük Hero Kartı */}
        <HeroCard />

        {/* Sonraki Adım: Yatay Listeler... */}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
