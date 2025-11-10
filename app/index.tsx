import MainNavigator from '@/src/navigation/MainNavigator';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {

  return (
    <SafeAreaProvider>
        <MainNavigator />
    </SafeAreaProvider>
  );
}