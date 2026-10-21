import { useConfig } from "@/hooks/use-config";
import { ButtonConfig } from "@/types";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Modal, View, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

interface MoreConfigModalProps {
  visible?: boolean;
  onClose?: () => void;
  buttonConfig?: ButtonConfig;
  modifyConfig?: (config: ButtonConfig) => void 
}

export function MoreConfigModal(props: MoreConfigModalProps) {

  const {
    visible = false,
    onClose,
    buttonConfig,
    modifyConfig,
  } = props;

  const [displayGridSize, setDisplayGridSize] = useState<number>(10);

  const { 
    gridSize, 
    buttonOpacity,
    setButtonOpacity,
    buttonShape,
    setButtonShape,
    saveButtonShape,
    saveGridSize,
    buttonMode,
    saveButtonMode,
  } = useConfig();

  const makeDebounce = (f: (newValue: number) => any) => {
    let timeout: number;
    return (newValue: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => f(newValue), 100);
    }
  }

  const debouncedSaveGridSize = makeDebounce(saveGridSize);

  useEffect(() => {
    setDisplayGridSize(gridSize);
  }, [gridSize]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
    >
      <SafeAreaView
        onTouchStart={() => onClose?.()}
        style={tw`flex-1 w-full bg-black/50 items-center py-5`}
      >
        <ScrollView
          onTouchStart={e => e.stopPropagation()}
          style={tw`flex-1 w-10/12 bg-slate-900 flex-col pt-4 pl-3`}
        >
          <Text
            style={tw`text-white text-2xl`}
          >
            Grid Spacing {displayGridSize}
          </Text>
          <Slider
            minimumValue={10}
            maximumValue={100}
            step={5}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={gridSize}
            onValueChange={(newValue) => {
              setDisplayGridSize(newValue);
              debouncedSaveGridSize(newValue);
            }}
          />
          <Text
            style={tw`text-white text-2xl mt-5`}
          >
            Button Opacity { buttonOpacity.toFixed(2) }
          </Text>
          <Slider 
            minimumValue={0.1}
            maximumValue={1}
            step={0.05}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={buttonOpacity}
            onValueChange={(newValue) => {
              setButtonOpacity(newValue);
            }}
          />
          <View
            style={tw`flex-row items-center justify-between mt-5 pr-4`}
          >
            <View style={tw`flex-col flex-1 mr-4`}>
              <Text style={tw`text-white text-2xl`}>
                Diamond Button Shape
              </Text>
              <Text style={tw`text-slate-400 text-sm mt-1`}>
                Rotate buttons 45 degrees into diamond shape
              </Text>
            </View>
            <TouchableOpacity
              style={[
                tw`px-4 py-2 rounded-lg border-2 border-stone-400 items-center justify-center min-w-16`,
                buttonShape === "DIAMOND" ? tw`bg-emerald-500 border-emerald-400` : tw`bg-transparent`,
              ]}
              onPress={() => saveButtonShape(buttonShape === "SQUARE" ? "DIAMOND" : "SQUARE")}
            >
              <Text style={tw`text-white text-base font-bold`}>
                {buttonShape === "DIAMOND" ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={tw`flex-row items-center justify-between mt-5 pr-4 pb-4`}
          >
            <View style={tw`flex-col flex-1 mr-4`}>
              <Text style={tw`text-white text-2xl`}>
                Immediate Mode
              </Text>
              <Text style={tw`text-slate-400 text-sm mt-1`}>
                Buttons activate immediately on touch or slide across
              </Text>
            </View>
            <TouchableOpacity
              style={[
                tw`px-4 py-2 rounded-lg border-2 border-stone-400 items-center justify-center min-w-16`,
                buttonMode === "IMMEDIATE" ? tw`bg-emerald-500 border-emerald-400` : tw`bg-transparent`,
              ]}
              onPress={() => saveButtonMode(buttonMode === "IMMEDIATE" ? "NORMAL" : "IMMEDIATE")}
            >
              <Text style={tw`text-white text-base font-bold`}>
                {buttonMode === "IMMEDIATE" ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}