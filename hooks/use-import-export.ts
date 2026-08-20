import { ControlsConfig } from "@/types";
import { useConfig } from "./use-config";
import { buttonsAtom } from "@/atoms";
import { useAtom } from "jotai";


interface UseReturn {
  importConfig: (configStr: string) => void;
  exportConfig: () => string;
}

export function useImportExport(): UseReturn {

  const { 
    buttonOpacity,
    setButtonOpacity,
    buttonShape,
    setButtonShape
  } = useConfig();

  const [buttons, setButtons] = useAtom(buttonsAtom);

  const importConfig = (configStr: string) => {
    const parsedJson: ControlsConfig = JSON.parse(configStr);

    // verify parsed JSON is correct
    if (parsedJson.buttonOpacity && parsedJson.buttonShape && parsedJson.buttons) {
      setButtonOpacity(parsedJson.buttonOpacity);
      setButtonShape(parsedJson.buttonShape);
      setButtons(parsedJson.buttons);
    } else {
      throw new Error("Invalid config");
    }
  }

  const exportConfig = () => {
    const config: ControlsConfig = {
      buttonOpacity: buttonOpacity,
      buttonShape: buttonShape,
      buttons: buttons,
    }
    return JSON.stringify(config);
  }

  return {
    importConfig: importConfig,
    exportConfig: exportConfig
  }
}