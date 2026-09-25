import { images } from '@/constants/images';
import { LANGUAGES } from '@/data/languages';
import { useLanguageStore } from '@/store/languageStore';
import { Language } from '@/data/languages';
import { Check, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { posthog } from '@/lib/posthog';
import { posthogLogger } from '@/lib/posthog-logger';

export default function LanguageSelectScreen() {
  const { setSelectedLanguage } = useLanguageStore();
  const [selectedCode, setSelectedCode] = useState<string>(LANGUAGES[0].code);
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedCode;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCode(item.code)}
        className={`flex-row items-center py-3.5 px-3.5 bg-white border-[1.5px] rounded-[14px] ${isSelected ? 'bg-[rgba(108,78,245,0.08)] border-lingua-purple' : 'border-transparent'}`}
        activeOpacity={0.8}
        style={styles.shadow}
      >
        <Image source={{ uri: item.flag }} style={styles.flag} />
        <View className="flex-1 ml-3">
          <Text className="font-poppins-semibold text-base text-text-primary">
            {item.name}
          </Text>
          <Text className="font-poppins text-sm text-text-secondary">
            {item.learners} okuyucu
          </Text>
        </View>
        {isSelected ? (
          <View className="w-6.5 h-6.5 rounded-full bg-lingua-purple items-center justify-center p-1">
            <Check size={14} color="#fff" />
          </View>
        ) : (
          <View className="w-6.5 h-6.5 rounded-full border-2 border-border" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'web' && styles.webContainer]}>
      <View className="flex-1 px-6">
        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Image source={images.mascotLogo} style={{ width: 40, height: 40 }} resizeMode="contain" />
          <Text className="font-poppins-semibold text-xl text-text-primary">
            wobbi
          </Text>
        </View>

        <Text className="font-poppins-bold text-[32px] text-text-primary leading-[40px] mt-8">
          Hangi dilde{'\n'}masal <Text className="text-lingua-purple">okuyalım?</Text>
        </Text>

        <View className="flex-row items-center bg-[#f6f7fb] rounded-2xl px-4 py-3.5 mt-6 border border-border">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 font-poppins text-base text-text-primary"
            placeholder="Dil ara..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ gap: 12, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          className="bg-lingua-purple rounded-2xl items-center justify-center mt-2 mb-6 py-4"
          activeOpacity={0.85}
          onPress={() => {
            const langData = LANGUAGES.find(l => l.code === selectedCode);
            setSelectedLanguage(selectedCode);
            posthog?.capture('language_selected', {
              language_code: selectedCode,
              language_name: langData?.name || selectedCode,
            });
            posthogLogger.languageSelectionCompleted(selectedCode);
            router.push('/(tabs)');
          }}
        >
          <Text className="font-poppins-semibold text-[17px] text-white">
            Devam Et
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  flag: {
    width: 40,
    height: 30,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
