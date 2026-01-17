import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameScreen } from "./screens/GameScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { ConfigScreen } from "./screens/ConfigScreen";
import { useColorScheme } from "react-native";
import { useState } from "react";
import * as  NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  menu: undefined;
  game: undefined;
  config: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

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
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen name="menu" options={{ headerShown: false }} component={MenuScreen} />
          <Stack.Screen name="game" options={{ headerShown: false }} component={GameScreen} />
          <Stack.Screen name="config" options={{ headerShown: false }} component={ConfigScreen} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  )
}