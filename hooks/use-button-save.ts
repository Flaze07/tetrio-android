import { buttonsAtom, buttonsLoadedAtom } from "@/atoms";
import { ButtonConfig } from "@/types";
import { useAtom } from "jotai";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_CONTROLS } from "@/constants/controls";

interface UseReturn {
  buttons: ButtonConfig[];
  saveButton: (newButtons: ButtonConfig[]) => Promise<void>;
}

export function useButtonSave(): UseReturn {

  const [buttons, setButtons] = useAtom(buttonsAtom);

  const loadButton = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("buttons");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const saveButton = async (newButtons: ButtonConfig[]) => {
    try {
      const jsonValue = JSON.stringify(newButtons);
      await AsyncStorage.setItem("buttons", jsonValue);
      setButtons(newButtons);
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

    })()
  }, []);

  return {
    buttons: buttons,
    saveButton: saveButton,
  }
}