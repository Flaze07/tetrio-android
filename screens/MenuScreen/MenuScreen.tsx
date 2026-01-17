import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";

type NavProps = NativeStackNavigationProp<RootStackParamList, "menu">;

export function MenuScreen() {

  const navigation = useNavigation<NavProps>();

  const handlePlay = () => {
    navigation.push("game");
  };

  const handleConfigure = () => {
    navigation.push("config");
  };

  return (
    <View style={tw`flex-1 w-full bg-slate-900 items-center justify-center`}>
      <Text style={tw`text-4xl font-bold text-white mb-16`}>
        Tetr.io Android
      </Text>

      <View style={tw`gap-6`}>
        <Pressable
          onPress={handlePlay}
          style={({ pressed }) => [
            tw`bg-emerald-500 px-16 py-4 rounded-xl shadow-lg`,
            pressed && tw`bg-emerald-600 opacity-90`,
          ]}
        >
          <Text style={tw`text-white text-xl font-semibold text-center`}>
            Play
          </Text>
        </Pressable>

        <Pressable
          onPress={handleConfigure}
          style={({ pressed }) => [
            tw`bg-indigo-500 px-16 py-4 rounded-xl shadow-lg`,
            pressed && tw`bg-indigo-600 opacity-90`,
          ]}
        >
          <Text style={tw`text-white text-xl font-semibold text-center`}>
            Configure Button
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
