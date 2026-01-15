import { TailwindColorName } from "@/constants/colors";

export interface ButtonConfig {
  id: string;
  position: {
    x: number;
    y: number;
  };
  color: TailwindColorName;
  keycode: string;
  size: {
    x: number;
    y: number;
  };
}
