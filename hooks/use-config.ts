import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { gridSizeAtom } from "@/atoms/config.atoms";

interface UseReturn {
  gridSize: number;
  saveGridSize: (newValue: number) => void;
}

export function useConfig(): UseReturn {

  const [gridSize, setGridSize] = useAtom(gridSizeAtom);

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
    saveGridSize: saveGridSize,
  }
}