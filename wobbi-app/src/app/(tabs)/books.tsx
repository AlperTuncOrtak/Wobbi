import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBooksByLanguage } from '@/data/books';
import { useLanguageStore } from '@/store/languageStore';
import { colors, textStyles } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, PlayCircle, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

export default function BooksScreen() {
  const { selectedLanguage } = useLanguageStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const books = getBooksByLanguage(selectedLanguage || 'tr');

  // Group books by category
  const categories = books.reduce((acc, book) => {
    const cat = book.category || 'Diğer';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(book);
    return acc;
  }, {} as Record<string, typeof books>);

  const renderBookCard = ({ item }: { item: any }) => {
    // Mock progress based on difficulty just for visual status
    const isCompleted = item.difficultyLevel === 'advanced';
    const progress = isCompleted ? 100 : item.difficultyLevel === 'intermediate' ? 45 : 0;

    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={() => router.push(`/book/${item.id}` as any)}>
        <View style={styles.imageWrapper}>
          <Image source={item.coverImage} style={styles.coverImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          {/* Status Indicator Overlay */}
          <View style={styles.statusBadge}>
            {isCompleted ? (
              <CheckCircle2 size={16} color="#fff" />
            ) : progress > 0 ? (
              <PlayCircle size={16} color="#fff" />
            ) : (
              <Lock size={16} color="rgba(255,255,255,0.7)" />
            )}
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {isCompleted ? 'Tamamlandı' : progress > 0 ? `%${progress} Okundu` : 'Başlanmadı'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>Masal Kitaplığı</Text>
        <Text style={styles.subtitle}>İstediğin masalı seç ve okumaya başla!</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        {Object.entries(categories).map(([categoryName, categoryBooks]) => (
          <View key={categoryName} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{categoryName}</Text>
            <FlatList
              horizontal
              data={categoryBooks}
              keyExtractor={(item) => item.id}
              renderItem={renderBookCard}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    paddingTop: 10,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    ...textStyles.h3,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.neutral.border,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
  cardInfo: {
    marginTop: 8,
  },
  bookTitle: {
    ...textStyles.button,
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.neutral.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.purple,
    borderRadius: 2,
  },
  progressText: {
    ...textStyles.caption,
    color: colors.neutral.textSecondary,
  },
});
