import { Stack } from "expo-router";

export default function MenuScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="menu" />
    </Stack>
  );
}