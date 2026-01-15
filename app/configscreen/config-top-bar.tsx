import { Dropdown } from "@/components/dropdown";
import { COLOR_NAME_TO_CLASS, COLOR_OPTIONS } from "@/constants/colors";
import { ButtonConfig } from "@/types";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface ConfigTopBarProps {
  onAddButton: () => void;
  currentSelectedIdx: number;
  currentButton: ButtonConfig | null;
  onSelectColor: (color: string) => void;
}

export function ConfigTopBar(props: ConfigTopBarProps) {

  const {
    onAddButton,
    currentSelectedIdx,
    currentButton,
    onSelectColor
  } = props;

  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);

  return (
    <View
      style={tw`flex-row mt-2`}
    >
      <TouchableOpacity
        onPress={onAddButton}
        style={tw`border border-slate-600 px-4 py-2 rounded-lg`}
      >
        <Text
          style={tw`text-white`}
        >
          Add
        </Text>
      </TouchableOpacity>
      <View
        style={tw`${currentSelectedIdx === -1 ? 'hidden' : 'flex-row w-full pr-40 items-center ml-2'}`}
      >
        <Text
          style={tw`text-white`}
        >
          Select Color
        </Text>
        <TouchableOpacity
          onPress={() => setShowColorDropdown(true)}
          style={tw`border border-slate-600 px-4 py-2 rounded-lg ml-3`}
        >
          <View style={tw`flex-row items-center`}>
            {currentButton?.color && (
              <View style={tw`w-3 h-3 rounded-full ${COLOR_NAME_TO_CLASS[currentButton.color]} mr-2`} />
            )}
            <Text style={tw`text-white capitalize`}>
              {currentButton?.color || "Select Color"}
            </Text>
          </View>
        </TouchableOpacity>
        <Dropdown
          options={COLOR_OPTIONS}
          showDropdown={showColorDropdown}
          onSelectOption={(option) => {
            onSelectColor(option.name);
            setShowColorDropdown(false);
          }}
          onClose={() => setShowColorDropdown(false)}
          optionComponent={(option) => (
            <View style={tw`flex-row items-center p-4 border-b border-slate-800`}>
              <View style={tw`w-6 h-6 rounded-full ${option.className} mr-3`} />
              <Text style={tw`text-white capitalize`}>{option.name}</Text>
            </View>
          )}
        />
        <View
          style={tw`flex-1`}
        />
        <TouchableOpacity
          style={tw`bg-red-500 px-4 py-2 rounded-lg`}
        >
          <Text
            style={tw`text-white`}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}