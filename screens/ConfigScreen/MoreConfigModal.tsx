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

  const { gridSize, saveGridSize } = useConfig();

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
          {
            buttonConfig !== undefined && (
              <View
              >
                <View
                  style={tw`flex-row items-center mt-5 gap-4`}
                >
                  <Text
                    style={tw`text-white text-2xl`}
                  >
                    Diamond Button Shape
                  </Text>
                  <TouchableOpacity
                    style={[
                        tw`w-10 h-10 border-stone-400 border-4`,
                        buttonConfig.shape === "SQUARE" && tw`bg-transparent`,
                        buttonConfig.shape === "DIAMOND" && tw`bg-yellow-300`, 
                    ]}
                  >
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}