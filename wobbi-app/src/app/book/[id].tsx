import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBooksByLanguage, STORY_BOOKS } from '@/data/books';
import { getChaptersByBookId } from '@/data/chapters';
import { colors, textStyles } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Play, Lock } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const book = STORY_BOOKS.find(b => b.id === id);
  const chapters = getChaptersByBookId(id || '');

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={textStyles.body}>Kitap bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary.purple }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Cover Section */}
        <View style={styles.coverSection}>
          <ImageBackground source={book.coverImage} style={styles.coverImage}>
            <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent', '#ffffff']} style={styles.coverGradient} />
            
            {/* Back Button */}
            <SafeAreaView edges={['top']} style={styles.backButtonSafeArea}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ChevronLeft size={28} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>

            {/* Title & Desc */}
            <View style={styles.coverContent}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Chapters List */}
        <View style={[styles.chaptersContainer, { paddingBottom: insets.bottom + 40 }]}>
          <Text style={styles.chaptersHeader}>Bölümler ({chapters.length})</Text>

          {chapters.length === 0 ? (
            <Text style={styles.noChapters}>Yakında eklenecek!</Text>
          ) : (
            chapters.map((chapter, index) => {
              // Mock logic for progress: chapter 1 is done, chapter 2 is playable, rest are locked
              const isCompleted = index === 0;
              const isCurrent = index === 1;
              const isLocked = index > 1;

              return (
                <TouchableOpacity 
                  key={chapter.id}
                  style={[styles.chapterCard, isLocked && styles.chapterCardLocked]}
                  activeOpacity={isLocked ? 1 : 0.8}
                >
                  <View style={styles.chapterNumberBox}>
                    <Text style={styles.chapterNumber}>{chapter.order}</Text>
                  </View>
                  
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterDesc} numberOfLines={2}>{chapter.description}</Text>
                  </View>

                  <View style={styles.chapterStatus}>
                    {isCompleted ? (
                      <View style={[styles.statusIcon, { backgroundColor: '#4CAF50' }]}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                      </View>
                    ) : isCurrent ? (
                      <View style={[styles.statusIcon, { backgroundColor: colors.primary.purple }]}>
                        <Play size={14} color="#fff" fill="#fff" />
                      </View>
                    ) : (
                      <View style={[styles.statusIcon, { backgroundColor: '#E5E7EB' }]}>
                        <Lock size={14} color="#9CA3AF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverSection: {
    width: '100%',
    height: 350,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    ...StyleSheet.absoluteFill,
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 0,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  coverContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral.textPrimary,
    marginBottom: 8,
  },
  description: {
    ...textStyles.body,
    color: colors.neutral.textSecondary,
  },
  chaptersContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  chaptersHeader: {
    ...textStyles.h3,
    marginBottom: 20,
  },
  noChapters: {
    ...textStyles.body,
    color: colors.neutral.textSecondary,
    fontStyle: 'italic',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: colors.neutral.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chapterCardLocked: {
    opacity: 0.6,
    backgroundColor: '#FAFAFA',
  },
  chapterNumberBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  chapterNumber: {
    ...textStyles.h3,
    color: colors.neutral.textPrimary,
  },
  chapterInfo: {
    flex: 1,
    paddingRight: 10,
  },
  chapterTitle: {
    ...textStyles.button,
    color: colors.neutral.textPrimary,
    marginBottom: 4,
  },
  chapterDesc: {
    ...textStyles.caption,
    color: colors.neutral.textSecondary,
  },
  chapterStatus: {
    marginLeft: 'auto',
  },
  statusIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
