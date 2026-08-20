import { atom } from "jotai";

export const gridSizeAtom = atom<number>(10);
export const buttonOpacityAtom = atom<number>(1);
export const buttonShapeAtom = atom<"SQUARE" | "DIAMOND">("SQUARE");