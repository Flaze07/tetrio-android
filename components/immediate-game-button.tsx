import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { CONTROLS_ELEMENT } from "@/constants/controls";
import { ButtonConfig } from "@/types";
import { View } from "react-native";
import tw from "twrnc";

interface ImmediateGameButtonProps {
  button: ButtonConfig;
  isPressed?: boolean;
}

export function ImmediateGameButton({ button, isPressed = false }: ImmediateGameButtonProps) {
  const color = COLOR_NAME_TO_CLASS[button.color];
  const opacity = button.opacity ?? 1;
  const shape = button.shape ?? "SQUARE";

  return (
    <View
      pointerEvents="none"
      style={[
        tw`absolute ${color} items-center justify-center`,
        {
          width: button.size.x,
          height: button.size.y,
          opacity: isPressed
            ? Math.max(0, opacity - 0.4)
            : opacity,
          transform: [
            {
              translateX: button.position.x,
            },
            {
              translateY: button.position.y,
            },
            {
              rotate: shape === "SQUARE" ? "0deg" : "45deg",
            },
          ],
        },
      ]}
    >
      {CONTROLS_ELEMENT[button.keycode]}
    </View>
  );
}
