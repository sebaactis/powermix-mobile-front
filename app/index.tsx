import { toastConfig } from '@/components/toast/config/toastConfig';
import { BG, CARD_BG } from '@/src/constant';
import { AuthProvider } from '@/src/context/AuthContext';
import MainNavigator from '@/src/navigation/MainNavigator';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import AnimatedSplash from './AnimatedSplash';

export default function App() {

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    offlineAccess: false,
  });



  const [isAppReady, setIsAppReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
          <Toast
            config={toastConfig}
            topOffset={60}
            visibilityTime={2500}

          />

          {showSplash && (
            <AnimatedSplash
              isAppReady={isAppReady}
              onAnimationEnd={() => setShowSplash(false)}
            />
          )}
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