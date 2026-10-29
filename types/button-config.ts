import { TailwindColorName } from "@/constants/colors";
import { CONTROL_TYPE, CONTROL_VALUE } from "@/constants/controls";

export type ButtonMode = "NORMAL" | "IMMEDIATE";

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
  shape?: "DIAMOND" | "SQUARE";
  opacity?: number;
  mode?: ButtonMode;
}

export interface ControlsConfig {
  buttonOpacity: number;
  buttonShape: "SQUARE" | "DIAMOND";
  buttons: ButtonConfig[];
}