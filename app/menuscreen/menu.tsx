import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";

export default function Menu() {
  const router = useRouter();

  const handlePlay = () => {
    router.push("/gamescreen");
  };

  const handleConfigure = () => {
    router.push("/configscreen/config");
  };

  return (
    <View style={tw`flex-1 w-full bg-slate-900 items-center justify-center`}>
      <Text style={tw`text-4xl font-bold text-white mb-16`}>
        Main Menu
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
