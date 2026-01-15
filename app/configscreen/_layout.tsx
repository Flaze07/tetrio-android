import { Stack } from "expo-router";

export default function ConfigScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="config" />
    </Stack>
  );
}