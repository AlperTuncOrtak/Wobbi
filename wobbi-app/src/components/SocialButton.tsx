import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Colors } from "@/constants/theme";

interface Props {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export default function SocialButton({ icon, label, onPress }: Props) {
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border, backgroundColor: colors.cardBg }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  }
});
