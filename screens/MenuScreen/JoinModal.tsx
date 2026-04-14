import { RootStackParamList } from "@/App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native"
import tw from "twrnc";

interface Props {
  visible?: boolean;
  onClose?: () => void;
}

type NavProps = NativeStackNavigationProp<RootStackParamList, "menu">;

export const JoinModal = (props: Props) => {

  const {
    visible: modalVisible,
    onClose: handleCloseModal,
  } = props;

  const navigation = useNavigation<NavProps>();

  const [roomCode, setRoomCode] = useState<string>("");

  const onJoinRoom = () => {
    if (roomCode.trim()) {
      navigation.push("game", { roomCode: roomCode.trim().toUpperCase() });
      handleCloseModal?.();
      setRoomCode("");
    }
  };

  return (
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
              onPress={onJoinRoom}
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
  )
}