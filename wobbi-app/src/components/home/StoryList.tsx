import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Heart, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StoryBook } from '@/data/books';

interface StoryListProps {
  title: string;
  books: StoryBook[];
  delay?: number;
}

export default function StoryList({ title, books, delay = 300 }: StoryListProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.night;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.textMuted }]}>Tümünü gör</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <TouchableOpacity 
            key={book.id} 
            activeOpacity={0.8} 
            style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => router.push(`/book/${book.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image source={book.coverImage} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.heartBtn}>
                <Heart size={14} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.info}>
              <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
                {book.title}
              </Text>
              
              <View style={styles.metaRow}>
                <View style={[styles.metaPill, { backgroundColor: colors.background }]}>
                  <Clock size={10} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>7 dk</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: colors.background }]}>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    {book.category === 'sleep' ? 'Uyku' : book.category === 'adventure' ? 'Macera' : 'Hayvanlar'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  seeAll: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    width: 160,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 160,
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 14,
  },
  bookTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  metaText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  }
});
