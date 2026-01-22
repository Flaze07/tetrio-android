import { DraggableButton } from "@/components/draggable-button";
import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { ButtonConfig } from "@/types";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { ConfigTopBar } from "./config-top-bar";
import { CONTROL_VALUE, DEFAULT_CONTROLS } from "@/constants/controls";
import { useButtonSave } from "@/hooks/use-button-save";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { MoreConfigModal } from "./MoreConfigModal";
import { useConfig } from "@/hooks/use-config";

// Generate a random string ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function ConfigScreen() {

  const {
    buttons: loadedButtons,
    saveButton,
  } = useButtonSave();

  const { gridSize } = useConfig();

  const [showMoreConfig, setShowMoreConfig] = useState<boolean>(false);

  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  const [currentSelectedIdx, setCurrentSelectedIdx] = useState<number>(-1);

  const onSelectColor = (color: string) => {
    if (currentSelectedIdx === -1) return;
    setButtons(prev => {
      const newButtons = [...prev];
      newButtons[currentSelectedIdx] = {
        ...newButtons[currentSelectedIdx],
        color: color as any,
      };
      return newButtons;
    })
  }

  const onAddButton = () => {
    setButtons([
      ...buttons,
      {
        id: generateId(),
        position: {
          x: 0,
          y: 0,
        },
        color: "red",
        keycode: "empty",
        size: {
          x: 80,
          y: 80,
        }
      },
    ]);
  }

  const onDeleteButton = () => {
    if (currentSelectedIdx === -1) return;
    setButtons(prev => {
      const newButtons = [...prev];
      newButtons.splice(currentSelectedIdx, 1);
      return newButtons;
    })
    setCurrentSelectedIdx(-1);
  }

  const onKeycodeChange = (newValue: CONTROL_VALUE) => {
    if (currentSelectedIdx === -1) return;
    setButtons((prev) => {
      const newButtons = [...prev];
      newButtons[currentSelectedIdx] = {
        ...newButtons[currentSelectedIdx],
        keycode: newValue,
      };
      return newButtons;
    })
  }

  const onSizeChange = (size: number) => {
    if (currentSelectedIdx === -1) return;
    setButtons((prev) => {
      const newButtons = [...prev];
      newButtons[currentSelectedIdx] = {
        ...newButtons[currentSelectedIdx],
        size: {
          x: size,
          y: size,
        },
      };
      return newButtons;
    })
  }

  const onSave = () => {
    saveButton(buttons);
  }

  const onReset = () => {
    setButtons(DEFAULT_CONTROLS);
  }

  useEffect(() => {
    const temp = [...loadedButtons];
    setButtons(temp);
  }, [loadedButtons]);

  return (
    <SafeAreaView
      style={tw`flex-1 w-full bg-slate-900 flex-col`}
    >
      <ConfigTopBar
        onSelectColor={color => onSelectColor(color)}
        currentSelectedIdx={currentSelectedIdx}
        currentButton={currentSelectedIdx === -1 ? null : buttons[currentSelectedIdx]}
        onAddButton={() => onAddButton()}
        onDeleteButton={() => onDeleteButton()}
        onSave={() => onSave()}
        onKeycodeChange={(newValue) => onKeycodeChange(newValue)}
        onSizeChange={(size) => onSizeChange(size)}
      />
      <View
        style={tw`flex-shrink flex-row mt-2`}
      >
        <TouchableOpacity
          onPress={() => setShowMoreConfig(true)}
          style={tw`border border-slate-600 px-4 py-2 rounded-lg`}
        >
          <MaterialIcon
            name="menu"
            color={"white"}
            size={22}
          />
        </TouchableOpacity>
      </View>
      <MoreConfigModal
        visible={showMoreConfig}
        onClose={() => setShowMoreConfig(false)}
      />
      {
        buttons.map((button, idx) => (
          <DraggableButton
            gridDivision={gridSize}
            key={button.id}
            keycode={button.keycode}
            size={button.size.x}
            initialX={button.position.x}
            initialY={button.position.y}
            colorClass={COLOR_NAME_TO_CLASS[button.color]}
            onPress={() => setCurrentSelectedIdx(idx)}
            onPositionChange={(position: { x: number; y: number }) => {
              setButtons(prev => {
                const newButtons = [...prev];
                newButtons[idx] = {
                  ...newButtons[idx],
                  position: position,
                };
                return newButtons;
              })
            }}
          />
        ))
      }
      <View style={tw`flex-1`} />
      <View
        style={tw`flex-row pb-2`}
      >
        <TouchableOpacity
          onPressIn={() => {
            onReset();
          }}
          style={tw`border bg-green-700 px-4 py-2 rounded-lg`}
        >
          <Text
            style={tw`text-white`}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
} 