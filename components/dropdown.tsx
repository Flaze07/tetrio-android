import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface DropdownProps {
  options: any[];
  showDropdown: boolean;
  onSelectOption: (option: any) => void;
  optionComponent: (option: any) => React.ReactNode;
  onClose: () => void;
}

export function Dropdown(props: DropdownProps) {

  const {
    options,
    showDropdown = false,
    onSelectOption,
    optionComponent,
    onClose,
  } = props;

  return (
    <Modal
      visible={showDropdown}
      animationType="slide"
      onRequestClose={() => onClose()}
      statusBarTranslucent
      navigationBarTranslucent
      transparent
    >
      <View
        onTouchStart={() => onClose()}
        style={tw`flex-1 bg-black/50 items-center py-10`}
      >
        <ScrollView
          onTouchStart={(e) => e.stopPropagation()}
          style={tw`bg-black w-4/6`}
        >
          {
            options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onSelectOption(option)}
              >
                {optionComponent(option)}
              </TouchableOpacity>
            ))
          }
        </ScrollView>

      </View>
    </Modal>
  )
}