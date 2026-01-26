import { useRouter } from "expo-router";
import { Pressable, Text, View, Modal, TextInput } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { useState } from "react";

type NavProps = NativeStackNavigationProp<RootStackParamList, "menu">;

export function MenuScreen() {

  const navigation = useNavigation<NavProps>();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handlePlay = () => {
    navigation.push("game");
  };

  const handleConfigure = () => {
    navigation.push("config");
  };

  const handleJoinRoom = () => {
    setModalVisible(true);
  };

  const handleJoinRoomSubmit = () => {
    if (roomCode.trim()) {
      navigation.push("game", { roomCode: roomCode.trim().toUpperCase() });
      setModalVisible(false);
      setRoomCode("");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setRoomCode("");
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
          onPress={handleJoinRoom}
          style={({ pressed }) => [
            tw`bg-blue-500 px-16 py-4 rounded-xl shadow-lg`,
            pressed && tw`bg-blue-600 opacity-90`,
          ]}
        >
          <Text style={tw`text-white text-xl font-semibold text-center`}>
            Join Room
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={tw`flex-1 items-center justify-center bg-black/70`}>
          <View style={tw`bg-slate-800 rounded-2xl p-8 w-80 shadow-2xl`}>
            <Text style={tw`text-2xl font-bold text-white mb-6 text-center`}>
              Join Room
            </Text>

            <TextInput
              style={tw`bg-slate-700 text-white px-4 py-3 rounded-lg mb-6 text-lg`}
              placeholder="Enter room code"
              placeholderTextColor="#94a3b8"
              value={roomCode}
              onChangeText={setRoomCode}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={tw`gap-3`}>
              <Pressable
                onPress={handleJoinRoomSubmit}
                style={({ pressed }) => [
                  tw`bg-emerald-500 px-6 py-3 rounded-lg`,
                  pressed && tw`bg-emerald-600 opacity-90`,
                ]}
              >
                <Text style={tw`text-white text-lg font-semibold text-center`}>
                  Join
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCloseModal}
                style={({ pressed }) => [
                  tw`bg-slate-600 px-6 py-3 rounded-lg`,
                  pressed && tw`bg-slate-700 opacity-90`,
                ]}
              >
                <Text style={tw`text-white text-lg font-semibold text-center`}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
