import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './src/context/AuthContext';
import { DriverProvider } from './src/context/DriverContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';
import i18n from './src/strings';

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <DriverProvider>
            <StatusBar style="light" backgroundColor={colors.surface} />
            <RootNavigator />
          </DriverProvider>
        </AuthProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
