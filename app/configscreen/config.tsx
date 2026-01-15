import { DraggableButton } from "@/components/draggable-button";
import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { ButtonConfig } from "@/types";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { ConfigTopBar } from "./config-top-bar";

// Generate a random string ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Config() {

  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  const [currentSelectedIdx, setCurrentSelectedIdx] = useState<number>(-1);

  return (
    <SafeAreaView
      style={tw`flex-1 w-full bg-slate-900`}
    >
      <ConfigTopBar
        onSelectColor={(color) => {
          if (currentSelectedIdx === -1) return;
          setButtons(prev => {
            const newButtons = [...prev];
            newButtons[currentSelectedIdx] = {
              ...newButtons[currentSelectedIdx],
              color: color as any,
            };
            return newButtons;
          })
        }}
        currentSelectedIdx={currentSelectedIdx}
        currentButton={currentSelectedIdx === -1 ? null : buttons[currentSelectedIdx]}
        onAddButton={() => {
          setButtons([
            ...buttons,
            {
              id: generateId(),
              position: {
                x: 0,
                y: 0,
              },
              color: "red",
              keycode: "",
              size: {
                x: 50,
                y: 50,
              }
            },
          ]);
        }}
      />
      {
        buttons.map((button, idx) => (
          <DraggableButton
            key={button.id}
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
    </SafeAreaView>
  )
} 