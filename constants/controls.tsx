import MaterialIcon from "@expo/vector-icons/MaterialIcons";

export const CONTROLS = {
  empty: "empty",
  moveLeft: "ARROWLEFT",
  moveRight: "ARROWRIGHT",
  softDrop: "ARROWDOWN",
  hardDrop: "SPACE",
  rotateCCW: "CONTROL",
  rotateCW: "ARROWUP",
  rotate180: "A",
  hold: "SHIFT",
  exit: "ESCAPE",
  retry: "R",
  chat: "T",
  // target1: "1",
  // target2: "2",
  // target3: "3",
  // target4: "4",
  // menuUp: "W",
  // menuDown: "S",
  // menuLeft: "A",
  // menuRight: "D",
  // menuBack: "ESCAPE",
  // menuConfirm: "ENTER",
  // openSocial: "TAB",
};

export const CONTROLS_ELEMENT: any = {
  empty: <MaterialIcon name="question-mark" size={24} color="black" />,
  ARROWLEFT: <MaterialIcon name="keyboard-arrow-left" size={24} color="black" />,
  ARROWRIGHT: <MaterialIcon name="keyboard-arrow-right" size={24} color="black" />,
  ARROWDOWN: <MaterialIcon name="keyboard-arrow-down" size={24} color="black" />,
  SPACE: <MaterialIcon name="keyboard-double-arrow-down" size={24} color="black" />,
  CONTROL: <MaterialIcon name="rotate-left" size={24} color="black" />,
  ARROWUP: <MaterialIcon name="rotate-right" size={24} color="black" />,
  A: <MaterialIcon name="flip" size={24} color="black" />,
  SHIFT: <MaterialIcon name="check-box-outline-blank" size={24} color="black" />,
  ESCAPE: <MaterialIcon name="transit-enterexit" size={24} color="black" />,
  R: <MaterialIcon name="refresh" size={24} color="black" />,
  T: <MaterialIcon name="chat" size={24} color="black" />,
  // menuUp: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // menuDown: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // menuLeft: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // menuRight: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // menuBack: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // menuConfirm: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
  // openSocial: <MaterialIcon name="keyboard-arrow-up" size={24} color="black" />,
}

export const CONTROLS_LIST = Object.entries(CONTROLS).map(([key, value]) => ({
  key,
  value,
}));

export type CONTROL_TYPE = keyof typeof CONTROLS;