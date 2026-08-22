import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { CONTROLS_ELEMENT } from "@/constants/controls";
import { ButtonConfig } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import tw from "twrnc";

interface Props {
  button: ButtonConfig;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export function GameButton(props: Props) {
  const {
    button,
    onPressIn,
    onPressOut,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const color = COLOR_NAME_TO_CLASS[button.color];

  const pressIn = () => {
    setIsPressed(true);
    onPressIn?.();
  };

  const pressOut = () => {
    setIsPressed(false);
    onPressOut?.();
  };

  const gesture = Gesture.Manual()
    .runOnJS(true)

    .onTouchesDown((event) => {
      if (event.changedTouches.length > 0) {
        pressIn();
      }
    })

    .onTouchesUp((event) => {
      if (event.changedTouches.length > 0) {
        pressOut();
      }
    })

    .onTouchesCancelled((event) => {
      if (event.changedTouches.length > 0) {
        pressOut();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          tw`absolute ${color} items-center justify-center`,
          {
            width: button.size.x,
            height: button.size.y,

            opacity: isPressed
              ? Math.max(0, button.opacity - 0.4)
              : button.opacity,

            transform: [
              {
                translateX: button.position.x,
              },
              {
                translateY: button.position.y,
              },
              {
                rotate:
                  button.shape === "SQUARE"
                    ? "0deg"
                    : "45deg",
              },
            ],
          },
        ]}
      >
        {CONTROLS_ELEMENT[button.keycode]}
      </View>
    </GestureDetector>
  );
}