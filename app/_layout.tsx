import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from '@/contexts/LocalizationContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
