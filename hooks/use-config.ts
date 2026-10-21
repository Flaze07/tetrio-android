import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { ButtonMode, buttonModeAtom, buttonOpacityAtom, buttonShapeAtom, gridSizeAtom } from "@/atoms/config.atoms";

interface UseReturn {
  gridSize: number;
  buttonOpacity: number;
  setButtonOpacity: (newValue: number) => void;
  buttonShape: "SQUARE" | "DIAMOND";
  setButtonShape: (newValue: "SQUARE" | "DIAMOND") => void;
  saveButtonShape: (newValue: "SQUARE" | "DIAMOND") => void;
  saveGridSize: (newValue: number) => void;
  buttonMode: ButtonMode;
  setButtonMode: (newValue: ButtonMode) => void;
  saveButtonMode: (newValue: ButtonMode) => void;
}

export function useConfig(): UseReturn {

  const [gridSize, setGridSize] = useAtom(gridSizeAtom);
  const [buttonOpacity, setButtonOpacity] = useAtom(buttonOpacityAtom);
  const [buttonShape, setButtonShape] = useAtom(buttonShapeAtom);
  const [buttonMode, setButtonMode] = useAtom(buttonModeAtom);

  const loadGridSize = async () => {
    try {
      const gridSizeLoaded = await AsyncStorage.getItem("gridSize");
      const parsed = gridSizeLoaded ? parseInt(gridSizeLoaded) : 10;
      setGridSize(parsed);
    } catch (e) {
      console.log(e);
    }
  };

  const saveGridSize = async (newValue: number) => {
    try {
      await AsyncStorage.setItem("gridSize", newValue.toString());
      setGridSize(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  const loadButtonMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem("buttonMode");
      if (savedMode === "NORMAL" || savedMode === "IMMEDIATE") {
        setButtonMode(savedMode);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const loadButtonShape = async () => {
    try {
      const savedShape = await AsyncStorage.getItem("buttonShape");
      if (savedShape === "SQUARE" || savedShape === "DIAMOND") {
        setButtonShape(savedShape);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveButtonShape = async (newValue: "SQUARE" | "DIAMOND") => {
    try {
      await AsyncStorage.setItem("buttonShape", newValue);
      setButtonShape(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  const saveButtonMode = async (newValue: ButtonMode) => {
    try {
      await AsyncStorage.setItem("buttonMode", newValue);
      setButtonMode(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadGridSize();
    loadButtonMode();
    loadButtonShape();
  }, []);

  return {
    gridSize: gridSize,
    buttonOpacity: buttonOpacity,
    setButtonOpacity: setButtonOpacity,
    buttonShape: buttonShape,
    setButtonShape: setButtonShape,
    saveButtonShape: saveButtonShape,
    saveGridSize: saveGridSize,
    buttonMode: buttonMode,
    setButtonMode: setButtonMode,
    saveButtonMode: saveButtonMode,
  }
}