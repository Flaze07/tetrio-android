import { useState } from "react";
import { Modal, TextInput, TouchableOpacity, View, Text } from "react-native";
import tw from "twrnc"

interface Props {
  visible?: boolean;
  onClose?: () => void;
}

export const ViewReplayModal = (props: Props) => {

  const {
    visible,
    onClose,
  } = props;

  const [fileName, setFilename] = useState<string>("");

  const onCancel = () => {
    onClose?.();
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 items-center justify-center bg-black/70`}>
        <View style={tw`bg-slate-800 rounded-2xl p-8 w-3/6 shadow-2xl`}>
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
              style={tw`bg-green-600 px-6 py-3 rounded-lg flex-grow`}
            >
              <Text
                style={tw`text-white text-lg font-semibold text-center`}
              >
                Select File
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