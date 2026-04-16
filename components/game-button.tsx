import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { CONTROLS_ELEMENT } from "@/constants/controls";
import { ButtonConfig } from "@/types";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
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

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const color = COLOR_NAME_TO_CLASS[button.color];

  const handlePressIn = () => {
    setIsPressed(true);
    onPressIn?.();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    onPressOut?.();
  };

  const tap = Gesture.LongPress()
    .minDuration(0)
    .runOnJS(true)
    .onBegin(() => handlePressIn())
    .onFinalize(() => handlePressOut());


  return (
    <GestureDetector
      gesture={tap}
      // onPressIn={onPressIn}
      // onPressOut={onPressOut}
    >
      <View
        style={[
          tw`absolute ${color} items-center justify-center`,
          isPressed && tw`opacity-30`,
          !isPressed && tw`opacity-70`,
          {
            width: button.size.x,
            height: button.size.y,

            transform: [
              { translateX: button.position.x },
              { translateY: button.position.y },
            ]
          }
        ]}
      >
        {CONTROLS_ELEMENT[button.keycode]}
      </View>
    </GestureDetector>
  )
}
