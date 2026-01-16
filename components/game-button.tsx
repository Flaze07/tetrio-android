import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { CONTROLS_ELEMENT } from "@/constants/controls";
import { ButtonConfig } from "@/types";
import { TouchableOpacity, View } from "react-native";
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

  const color = COLOR_NAME_TO_CLASS[button.color];

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        tw`absolute ${color} opacity-70 items-center justify-center`,
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
    </TouchableOpacity>
  )
}