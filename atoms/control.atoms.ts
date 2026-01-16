import { atom } from "jotai";
import { ButtonConfig } from "@/types";

export const buttonsAtom = atom<ButtonConfig[]>([]);
export const buttonsLoadedAtom = atom<boolean>(false);