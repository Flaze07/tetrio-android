import { atom } from "jotai";

import { ButtonMode } from "@/types";

export const gridSizeAtom = atom<number>(10);
export const buttonOpacityAtom = atom<number>(1);
export const buttonShapeAtom = atom<"SQUARE" | "DIAMOND">("SQUARE");
export type { ButtonMode };
export const buttonModeAtom = atom<ButtonMode>("NORMAL");