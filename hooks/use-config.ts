import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { buttonOpacityAtom, buttonShapeAtom, gridSizeAtom } from "@/atoms/config.atoms";

interface UseReturn {
  gridSize: number;
  buttonOpacity: number;
  setButtonOpacity: (newValue: number) => void;
  buttonShape: "SQUARE" | "DIAMOND";
  setButtonShape: (newValue: "SQUARE" | "DIAMOND") => void;
  saveGridSize: (newValue: number) => void;
}

export function useConfig(): UseReturn {

  const [gridSize, setGridSize] = useAtom(gridSizeAtom);
  const [buttonOpacity, setButtonOpacity] = useAtom(buttonOpacityAtom);
  const [buttonShape, setButtonShape] = useAtom(buttonShapeAtom);

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
  }

  useEffect(() => {
    loadGridSize();
  }, []);

  return {
    gridSize: gridSize,
    buttonOpacity: buttonOpacity,
    setButtonOpacity: setButtonOpacity,
    buttonShape: buttonShape,
    setButtonShape: setButtonShape,
    saveGridSize: saveGridSize,
  }
}