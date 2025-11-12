import { View, StyleSheet, Platform } from 'react-native';
import { BG } from '@/src/constant';

export default function Header() {
  return <View style={styles.headerContent} />;
}

const styles = StyleSheet.create({
  headerContent: {
    height: Platform.OS === "android" ? 60 : 0,
    backgroundColor: BG,
  },
});