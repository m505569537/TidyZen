import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold,
} from '@expo-google-fonts/be-vietnam-pro';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="camera"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="analyzing"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="result" />
        <Stack.Screen name="correction" />
        <Stack.Screen name="detail/[id]" />
        <Stack.Screen name="video/[id]" />
        <Stack.Screen name="record/[id]" />
        <Stack.Screen name="trends" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="help" />
        <Stack.Screen name="about" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="account" />
        <Stack.Screen name="room-templates" />
        <Stack.Screen name="suggestion-preferences" />
        <Stack.Screen name="notification-preferences" />
      </Stack>
    </>
  );
}
