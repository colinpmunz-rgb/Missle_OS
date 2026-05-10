import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { SplashScreen } from 'expo-splash-screen';
import { ClerkProvider, useAuth } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';
import {
  useFonts,
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
  EBGaramond_400Regular_Italic,
} from '@expo-google-fonts/eb-garamond';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestNotificationPermissions, scheduleDailyNotifications } from '../lib/notifications';
import { UpdateBanner } from '../components/ui/UpdateBanner';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

const tokenCache = {
  async getToken(key: string) { return SecureStore.getItemAsync(key); },
  async saveToken(key: string, value: string) { return SecureStore.setItemAsync(key, value); },
  async clearToken(key: string) { return SecureStore.deleteItemAsync(key); },
};

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuth = segments[0] === '(auth)';
    if (!isSignedIn && !inAuth) router.replace('/(auth)/login');
    else if (isSignedIn && inAuth) router.replace('/(tabs)');
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({
    EBGaramond_400Regular, EBGaramond_500Medium, EBGaramond_600SemiBold,
    EBGaramond_700Bold, EBGaramond_400Regular_Italic,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
      (async () => {
        const granted = await requestNotificationPermissions();
        if (granted) await scheduleDailyNotifications();
      })();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthGate />
      <UpdateBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <AppContent />
    </ClerkProvider>
  );
}
