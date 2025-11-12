import { View, StyleSheet } from 'react-native';
import { BG } from '@/src/constant';

export default function Header() {
  return <View style={styles.headerContent} />;
}

const styles = StyleSheet.create({
  headerContent: {
    backgroundColor: BG,
  },
});