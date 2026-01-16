import { TailwindColorName } from "@/constants/colors";
import { CONTROL_TYPE } from "@/constants/controls";

export interface ButtonConfig {
  id: string;
  position: {
    x: number;
    y: number;
  };
  color: TailwindColorName;
  keycode: CONTROL_TYPE;
  size: {
    x: number;
    y: number;
  };
}
