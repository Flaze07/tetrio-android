import { TailwindColorName } from "@/constants/colors";
import { CONTROL_TYPE, CONTROL_VALUE } from "@/constants/controls";

export interface ButtonConfig {
  id: string;
  position: {
    x: number;
    y: number;
  };
  color: TailwindColorName;
  keycode: CONTROL_VALUE;
  size: {
    x: number;
    y: number;
  };
}
