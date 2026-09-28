import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import HomeHeader from '@/components/home/HomeHeader';

export default function HomeScreen() {
  const { theme, autoSetTheme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;

  useEffect(() => { autoSetTheme(); }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme === 'day' ? 'dark-content' : 'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Adım 1: Header & Greeting */}
        <HomeHeader />

        {/* Diğer parçalar buraya eklenecek... */}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
