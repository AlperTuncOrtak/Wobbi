import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { TouchableOpacity, View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Compass, BookOpen, Smile, Library } from "lucide-react-native";
import { colors, textStyles } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = 52;
const TAB_HEIGHT = 64;

type TabConfig = {
  label: string;
  Icon: any;
};

// 4 Tabs as requested
const TABS: TabConfig[] = [
  { label: "Keşfet", Icon: Compass },
  { label: "Kitaplar", Icon: BookOpen },
  { label: "Karakterler", Icon: Smile },
  { label: "Kitaplık", Icon: Library },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  // Web Layout width clamping
  const actualWidth = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 420) : SCREEN_WIDTH;
  const tabWidth = actualWidth / TABS.length;

  const indicatorX = useSharedValue(
    state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2
  );

  useEffect(() => {
    indicatorX.value = withSpring(
      state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2,
      { damping: 18, stiffness: 160 }
    );
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      <Animated.View style={[styles.indicator, indicatorStyle]} />

      {state.routes.map((route, index) => {
        const tab = TABS[index];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <tab.Icon
              size={22}
              color={isFocused ? "#fff" : colors.neutral.textSecondary}
              strokeWidth={isFocused ? 2.5 : 2}
            />
            {!isFocused && <Text style={styles.label}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.neutral.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    ...(Platform.OS === 'web' ? {
      maxWidth: 420,
      width: '100%',
      alignSelf: 'center',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: colors.neutral.border,
    } : {})
  },
  indicator: {
    position: "absolute",
    top: (TAB_HEIGHT - CIRCLE_SIZE) / 2,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary.purple,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TAB_HEIGHT,
    zIndex: 2,
  },
  label: {
    ...textStyles.caption,
    marginTop: 3,
  },
});
