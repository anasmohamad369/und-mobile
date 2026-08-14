import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { ShopProvider } from './src/context/ShopContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10000,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ShopProvider>
            <NotificationProvider>
              <LanguageProvider>
                <StatusBar style="dark" />
                <View style={styles.container}>
                  <RootNavigator />
                </View>
              </LanguageProvider>
            </NotificationProvider>
          </ShopProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
