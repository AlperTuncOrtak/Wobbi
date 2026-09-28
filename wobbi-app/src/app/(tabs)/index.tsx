import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { STORY_BOOKS } from '@/data/books';

import HomeHeader from '@/components/home/HomeHeader';
import CategoryTabs from '@/components/home/CategoryTabs';
import HeroCard from '@/components/home/HeroCard';
import StoryList from '@/components/home/StoryList';

export default function HomeScreen() {
  const { theme, autoSetTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;
  
  const [activeCategory, setActiveCategory] = useState('sleep');

  useEffect(() => { autoSetTheme(); }, []);

  // Geçici mock veriler
  const popularBooks = STORY_BOOKS.slice(0, 4);
  const newBooks = STORY_BOOKS.slice(2, 6);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme === 'day' ? 'dark-content' : 'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Adım 1: Header */}
        <HomeHeader />

        {/* Adım 2: Kategoriler */}
        <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* Adım 3: Ana Hero Kartı */}
        <HeroCard />

        {/* Adım 4: Yatay Listeler */}
        <StoryList title="Bu Gece Popüler" books={popularBooks} delay={300} />
        <StoryList title="Bu Hafta Yeni" books={newBooks} delay={400} />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
