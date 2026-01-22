import { useConfig } from "@/hooks/use-config";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Modal, View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

interface MoreConfigModalProps {
  visible?: boolean;
  onClose?: () => void;
}

export function MoreConfigModal(props: MoreConfigModalProps) {

  const {
    visible = false,
    onClose,
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
        style={tw`flex-1 w-full bg-black/50 items-center`}
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
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}