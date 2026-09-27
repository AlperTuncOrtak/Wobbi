import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Download, Heart, Play, Trash2, Library as LibraryIcon } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { useDownloadStore } from '@/store/downloadStore';
import { STORY_BOOKS } from '@/data/books';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2; // 2 column grid, 24px padding sides, 16px gap

export default function LibraryScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState<'downloads' | 'favorites'>('downloads');
  
  const { downloads, deleteDownload } = useDownloadStore();
  
  // Eşleştirilen kitaplar (İndirilenler)
  const downloadedBooks = STORY_BOOKS.filter(book => downloads[book.id]);
  
  // Şimdilik favoriler boş (Daha sonra Supabase'den gelecek)
  const favoriteBooks = STORY_BOOKS.slice(0, 2); 

  const renderBook = (book: any, isDownloaded: boolean) => {
    const downloadData = downloads[book.id];
    const imageSource = isDownloaded && downloadData?.localImageUri
      ? { uri: downloadData.localImageUri }
      : (typeof book.coverImage === 'string' ? { uri: book.coverImage } : book.coverImage);

    return (
      <TouchableOpacity 
        key={book.id} 
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        activeOpacity={0.8}
        onPress={() => router.push(`/book/${book.id}`)}
      >
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
        
        {isDownloaded && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => deleteDownload(book.id)}
          >
            <Trash2 size={16} color="#FFF" />
          </TouchableOpacity>
        )}

        <View style={styles.cardContent}>
          <Text style={[styles.cardCategory, { color: colors.primary }]} numberOfLines={1}>
            {book.category}
          </Text>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
            {book.title}
          </Text>
          <View style={styles.playRow}>
            <Play size={14} color={colors.textMuted} fill={colors.textMuted} />
            <Text style={[styles.chapterText, { color: colors.textMuted }]}>
              {book.totalChapters} Bölüm
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Kütüphanem</Text>
          <LibraryIcon size={24} color={colors.text} />
        </View>

        {/* Custom Segmented Control */}
        <View style={[styles.tabContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'downloads' && { backgroundColor: colors.primary }]} 
            onPress={() => setActiveTab('downloads')}
          >
            <Download size={18} color={activeTab === 'downloads' ? '#FFF' : colors.textMuted} />
            <Text style={[styles.tabText, { color: activeTab === 'downloads' ? '#FFF' : colors.text }]}>İndirilenler</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'favorites' && { backgroundColor: colors.primary }]} 
            onPress={() => setActiveTab('favorites')}
          >
            <Heart size={18} color={activeTab === 'favorites' ? '#FFF' : colors.textMuted} />
            <Text style={[styles.tabText, { color: activeTab === 'favorites' ? '#FFF' : colors.text }]}>Favoriler</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'downloads' ? (
            downloadedBooks.length > 0 ? (
              <View style={styles.grid}>
                {downloadedBooks.map(b => renderBook(b, true))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Download size={48} color={colors.textMuted} style={{ marginBottom: 16 }} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Henüz Masal İndirmedin</Text>
                <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                  İnternetsiz dinlemek istediğin masalları kitap sayfasından indirebilirsin.
                </Text>
                <TouchableOpacity 
                  style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/books')}
                >
                  <Text style={styles.exploreBtnText}>Keşfet'e Git</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={styles.grid}>
              {favoriteBooks.map(b => renderBook(b, false))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // TabBar padding
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardCategory: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    height: 40,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chapterText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: '#FFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  }
});
