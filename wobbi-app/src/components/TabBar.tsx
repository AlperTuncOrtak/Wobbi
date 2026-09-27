import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, BookOpen, Ghost, User, Search } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const TABS = [
  { name: "index", label: "Keşfet", Icon: Home },
  { name: "books", label: "Kitaplık", Icon: BookOpen },
  { name: "characters", label: "Karakter", Icon: Ghost },
  { name: "profile", label: "Profil", Icon: User },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const isDay = theme === 'day';

  const ACTIVE_COLOR = colors.primary;
  const INACTIVE_COLOR = colors.textMuted;

  // ==========================================
  // 1. ANDROID İÇİN DÜZ (FLAT) TASARIM
  // ==========================================
  if (Platform.OS === 'android') {
    const BG_COLOR = isDay ? "#FFFFFF" : "#121322"; 
    const BORDER_COLOR = colors.border;
    
    return (
      <View style={[ styles.androidContainer, { backgroundColor: BG_COLOR, borderTopColor: BORDER_COLOR, paddingBottom: insets.bottom > 0 ? insets.bottom : 12 } ]}>
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity key={route.key} activeOpacity={0.7} onPress={onPress} style={styles.androidTabItem}>
              <tab.Icon size={24} color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR} strokeWidth={isFocused ? 2.5 : 2} style={{ marginBottom: 4 }} />
              <Text style={[styles.androidTabLabel, { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR }, isFocused && { fontFamily: "Poppins_700Bold" }]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ==========================================
  // 2. IOS İÇİN YÜZEN KAPSÜL (FLOATING PILL) TASARIM
  // ==========================================
  return (
    <View style={[styles.iosWrapper, { bottom: insets.bottom > 0 ? insets.bottom : 24 }]}>
      <BlurView 
        intensity={isDay ? 60 : 40} 
        tint={isDay ? "light" : "dark"} 
        style={[styles.iosContainer, { borderColor: colors.border }]}
      >
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity key={route.key} activeOpacity={0.7} onPress={onPress} style={styles.iosTabItem}>
              {isFocused && (
                <View style={[styles.iosActiveBackground, { backgroundColor: isDay ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} />
              )}
              <tab.Icon size={22} color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR} strokeWidth={isFocused ? 2.5 : 2} />
              <Text style={[styles.iosTabLabel, { color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR }]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>

      {/* iOS'e Özel Yüzen Arama Butonu */}
      <TouchableOpacity style={[styles.iosSearchButton, { backgroundColor: colors.primary, borderColor: colors.border }]}>
        <Search size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ANDROID STİLLERİ
  androidContainer: {
    width: "100%",
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 16,
    elevation: 20,
  },
  androidTabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  androidTabLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },
  
  // IOS STİLLERİ
  iosWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    width: width,
    zIndex: 100,
  },
  iosContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 16,
    paddingHorizontal: 8,
  },
  iosTabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iosActiveBackground: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iosTabLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    marginTop: 4,
  },
  iosSearchButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
});
