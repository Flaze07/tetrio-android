import { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc"
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system"
import { ToastAndroid } from "react-native";
import { useAtom } from "jotai";
import { replayDataAtom } from "@/atoms/replayData.atoms";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { useNavigation } from "expo-router";

interface Props {
  visible?: boolean;
  onClose?: () => void;
}

type NavProps = NativeStackNavigationProp<RootStackParamList, "menu">;

export const ViewReplayModal = (props: Props) => {

  const {
    visible,
    onClose,
  } = props;

  const navigation = useNavigation<NavProps>();

  const [_, setReplayData] = useAtom(replayDataAtom);

  const [fileName, setFilename] = useState<string>("");

  const onCancel = () => {
    onClose?.();
  }

  const pickAndReadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    })

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    const validExtension = [
      ".ttrm",
      ".json"
    ]

    if (!validExtension.includes(asset.name.slice(-5))) {
      ToastAndroid.show("Invalid file type. Please select a .ttrm file.", ToastAndroid.SHORT);
      return;
    }

    setFilename(asset.name);

    const file = new File(asset.uri);
    const base64 = await file.base64();
    setReplayData(base64);
  }

  const onViewReplay = () => {
    navigation.push("game", { viewReplay: true });
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 items-center justify-center bg-black/70`}>
        <View style={tw`bg-slate-800 rounded-2xl p-8 shadow-2xl`}>
          <TextInput
            style={tw`bg-slate-700 text-white px-4 py-3 rounded-lg mb-6 text-lg`}
            placeholder="Filename"
            placeholderTextColor="#94a3b8"
            value={fileName}
            onChangeText={setFilename}
            autoCapitalize="none"
            autoCorrect={false}
            readOnly
          />
          <View
            style={tw`flex-row gap-4`}
          >
            <TouchableOpacity
              onPress={() => pickAndReadFile()}
              style={tw`bg-green-600 px-6 py-3 rounded-lg flex-grow`}
            >
              <Text
                style={tw`text-white text-lg font-semibold text-center`}
              >
                Select File
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onViewReplay()}
              style={tw`bg-purple-600 px-6 py-3 rounded-lg flex-grow`}
            >
              <Text
                style={tw`text-white text-lg font-semibold text-center`}
              >
                View Replay
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-red-600 px-6 py-3 rounded-lg flex-grow`}
              onPress={() => onCancel()}
            >
              <Text
                style={tw`text-white text-lg font-semibold text-center`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
