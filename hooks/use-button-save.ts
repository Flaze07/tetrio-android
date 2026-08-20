import { buttonsAtom, buttonsLoadedAtom } from "@/atoms";
import { ButtonConfig } from "@/types";
import { useAtom } from "jotai";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_CONTROLS } from "@/constants/controls";
import { useConfig } from "./use-config";

interface UseReturn {
  buttons: ButtonConfig[];
  saveButton: (newButtons: ButtonConfig[]) => Promise<void>;
}

export function useButtonSave(): UseReturn {

  const { 
    buttonOpacity,
    setButtonOpacity,
    buttonShape,
    setButtonShape
  } = useConfig();
  const [buttons, setButtons] = useAtom(buttonsAtom);

  const loadButton = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("buttons");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const loadOpacity = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("buttonOpacity");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  const loadShape = async (): Promise<"SQUARE" | "DIAMOND"> => {
    try {
      const defaultShape = "SQUARE";
      const jsonValue = await AsyncStorage.getItem("buttonShape");
      return jsonValue !== null && (jsonValue === "SQUARE" || jsonValue === "DIAMOND")
      ? jsonValue
      : defaultShape;
    } catch (e) {
      console.log(e);
      return "SQUARE";
    }
  }

  const saveButton = async (newButtons: ButtonConfig[]) => {
    try {
      const jsonValue = JSON.stringify(newButtons);
      await AsyncStorage.setItem("buttons", jsonValue);
      setButtons(newButtons);

      const savedButtonOpacity = JSON.stringify(buttonOpacity);
      await AsyncStorage.setItem("buttonOpacity", savedButtonOpacity);
      
      await AsyncStorage.setItem("buttonShape", buttonShape);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {

      const buttons = await loadButton();
      if (buttons === null) {
        setButtons(DEFAULT_CONTROLS);
      } else {
        setButtons(buttons);
      }

      const opacity = await loadOpacity();
      if (opacity === null) {
        setButtonOpacity(1);
      } else {
        setButtonOpacity(opacity);
      }

      const shape = await loadShape();
      if (shape === null) {
        setButtonShape("SQUARE");
      } else {
        setButtonShape(shape);
      }
    })()
  }, []);

  return {
    buttons: buttons,
    saveButton: saveButton,
  }
}