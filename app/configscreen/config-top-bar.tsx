import { Dropdown } from "@/components/dropdown";
import { COLOR_NAME_TO_CLASS, COLOR_OPTIONS } from "@/constants/colors";
import { ButtonConfig } from "@/types";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { CONTROL_TYPE, CONTROLS_LIST } from "@/constants/controls";

interface ConfigTopBarProps {
  onAddButton: () => void;
  onDeleteButton: () => void;
  currentSelectedIdx: number;
  currentButton: ButtonConfig | null;
  onSelectColor: (color: string) => void;
  onSizeChange: (size: number) => void;
  onKeycodeChange: (keycode: CONTROL_TYPE) => void;
  onSave: () => void;
}

export function ConfigTopBar(props: ConfigTopBarProps) {

  const {
    onAddButton,
    onDeleteButton,
    currentSelectedIdx,
    currentButton,
    onSelectColor,
    onSizeChange,
    onKeycodeChange,
    onSave,
  } = props;

  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);
  const [showKeycodeDropdown, setShowKeycodeDropdown] = useState<boolean>(false);

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
      <TouchableOpacity
        onPress={onSave}
        style={tw`border border-slate-600 px-4 py-2 rounded-lg ml-2`}
      >
        <Text
          style={tw`text-white`}
        >
          Save
        </Text>
      </TouchableOpacity>
      <View
        style={tw`${currentSelectedIdx === -1 ? 'hidden' : 'flex-row w-full pr-40 items-center ml-2'}`}
      >
        <TouchableOpacity
          onPress={() => setShowColorDropdown(true)}
          style={tw`border border-slate-600 px-4 py-2 rounded-lg ml-2 mr-4`}
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

        <TouchableOpacity
          onPress={() => setShowKeycodeDropdown(true)}
          style={tw`border border-slate-600 px-4 py-2 rounded-lg ml-2 mr-4`}
        >
          <Text style={tw`text-white capitalize`}>
            {CONTROLS_LIST.find((control) => control.value === currentButton?.keycode)?.key}
          </Text>
        </TouchableOpacity>

        <Dropdown
          options={CONTROLS_LIST}
          showDropdown={showKeycodeDropdown}
          onSelectOption={(option) => {
            onKeycodeChange(option.value);
            setShowKeycodeDropdown(false);
          }}
          onClose={() => setShowKeycodeDropdown(false)}
          optionComponent={(option) => (
            <View style={tw`flex-row items-center p-4 border-b border-slate-800`}>
              <Text style={tw`text-white capitalize`}>{option.key}</Text>
            </View>
          )}
        />

        <Text style={tw`text-white mr-2`}>Size: {Math.round(currentButton?.size?.x || 0)}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={20}
          maximumValue={200}
          step={5}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={currentButton?.size?.x || 50}
          onValueChange={onSizeChange}
        />

        <View
          style={tw`flex-1`}
        />
        <TouchableOpacity
          onPress={() => onDeleteButton()}
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