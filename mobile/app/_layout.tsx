import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

export default function RootLayout() {
  const initializeAuth = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="lost/create"
            options={{ title: 'Report Lost Item', presentation: 'card' }}
          />
          <Stack.Screen
            name="lost/[id]"
            options={{ title: 'Lost Item Details', presentation: 'card' }}
          />
          <Stack.Screen
            name="found/create"
            options={{ title: 'Report Found Item', presentation: 'card' }}
          />
          <Stack.Screen
            name="found/[id]"
            options={{ title: 'Found Item Details', presentation: 'card' }}
          />
          <Stack.Screen
            name="matches/[id]"
            options={{ title: 'AI Match Analysis', presentation: 'card' }}
          />
          <Stack.Screen
            name="chat/[id]"
            options={{ title: 'Secure Chat', presentation: 'card' }}
          />
          <Stack.Screen
            name="my-reports/index"
            options={{ title: 'My Reports', presentation: 'card' }}
          />
          <Stack.Screen
            name="settings/index"
            options={{ title: 'Settings', presentation: 'card' }}
          />
          <Stack.Screen
            name="settings/privacy"
            options={{ title: 'Privacy & Safety', presentation: 'card' }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
