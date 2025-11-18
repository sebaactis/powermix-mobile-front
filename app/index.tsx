import { BG, CARD_BG } from '@/src/constant';
import { AuthProvider } from '@/src/context/AuthContext';
import MainNavigator from '@/src/navigation/MainNavigator';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={CARD_BG}
        translucent={Platform.OS === 'android'}
      />
      {Platform.OS === 'ios' && (
        <View style={styles.statusBarBackground} />
      )}
      <SafeAreaProvider style={styles.container}>
        <AuthProvider>
          <MainNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: BG,
    zIndex: 9999,
  },
  container: {
    flex: 1,
    backgroundColor: CARD_BG,
  },
});