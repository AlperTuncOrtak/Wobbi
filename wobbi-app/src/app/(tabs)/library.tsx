import { View, Text, StyleSheet } from 'react-native';
import { textStyles, colors } from '@/constants/theme';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={textStyles.h2}>Kitaplık Sekmesi</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.surface } });
