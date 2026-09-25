import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, textStyles } from '@/constants/theme';
import { images } from '@/constants/images';
import { Mic } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHARACTERS = [
  { 
    id: 'zumi', 
    name: 'Uzaylı Zumi', 
    tag: 'Yeni Başlayanlar', 
    color: colors.primary.purple, 
    image: images.mascotWelcome 
  },
  { 
    id: 'puf', 
    name: 'Ejderha Puf', 
    tag: 'Eğlenceli', 
    color: colors.primary.green, 
    image: images.mascotAuth 
  },
  { 
    id: 'kurnaz', 
    name: 'Tilki Titi', 
    tag: 'İleri Seviye', 
    color: colors.semantic.streak, 
    image: images.mascotLogo 
  },
];

const BouncyGridCard = ({ item }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Link href={`/chat/${item.id}`} asChild>
      <TouchableOpacity activeOpacity={0.8} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.cardContainer}>
      <Animated.View style={[styles.card, { backgroundColor: item.color + '15', borderColor: item.color + '40' }, animatedStyle]}>
        
        {/* Call Icon Badge */}
        <View style={[styles.callBadge, { backgroundColor: item.color }]}>
          <Mic size={16} color="#fff" />
        </View>
        
        <Image source={item.image} style={styles.characterImage} resizeMode="contain" />
        
        <Text style={styles.cardName}>{item.name}</Text>
        <View style={[styles.tagContainer, { backgroundColor: item.color + '30' }]}>
          <Text style={[styles.cardTag, { color: item.color }]}>{item.tag}</Text>
        </View>

        <Text style={styles.callPrompt}>Sohbet Et!</Text>
      </Animated.View>
    </TouchableOpacity>
    </Link>
  );
};

export default function CharactersScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={textStyles.h2}>Karakterler</Text>
        <Text style={styles.subtitle}>İstediğin karakterle sesli pratik yap.</Text>
      </View>
      <FlatList
        data={CHARACTERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BouncyGridCard item={item} />}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  cardContainer: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  callBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
    marginTop: 10,
  },
  cardName: {
    ...textStyles.h3,
    color: colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  tagContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTag: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  callPrompt: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  }
});
