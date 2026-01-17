import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from 'expo-router';
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: 'menuscreen',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [barVisibility, setBarVisibility] = useState<NavigationBar.NavigationBarVisibility>();

  const visibilityConfig = async () => {
    await NavigationBar.setVisibilityAsync("hidden");
  }

  useEffect(() => {
    visibilityConfig();
  }, [barVisibility])

  useEffect(() => {
    const subscription = NavigationBar.addVisibilityListener(({ visibility }) => {
      if (visibility === "visible") {
        setBarVisibility(visibility);
      }
    })

    return () => subscription.remove();
  }, [])

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    )
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="menuscreen" options={{ headerShown: false }} />
        <Stack.Screen name="gamescreen" options={{ headerShown: false }} />
        <Stack.Screen name="configscreen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar hidden />
    </ThemeProvider>
  );
}
