// Header.tsx
import { View, StyleSheet, Platform } from 'react-native';
import { MAIN_COLOR } from '@/src/constant';

export default function Header() {
  return <View style={styles.headerContent} />;
}

const styles = StyleSheet.create({
  headerContent: {
    height: Platform.OS === "android" ? 70 : 0,               // lo que quieras de alto
    backgroundColor: MAIN_COLOR,
  },
});