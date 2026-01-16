import { ButtonConfig } from "@/types";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import tw from "twrnc";

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
  empty: <MaterialIcon name="question-mark" size={30} color="black" />,
  ARROWLEFT: <MaterialIcon name="keyboard-arrow-left" size={30} color="black" />,
  ARROWRIGHT: <MaterialIcon name="keyboard-arrow-right" size={30} color="black" />,
  ARROWDOWN: <MaterialIcon name="keyboard-arrow-down" size={30} color="black" />,
  SPACE: <MaterialIcon name="keyboard-double-arrow-down" size={30} color="black" />,
  CONTROL: <MaterialIcon name="rotate-left" size={30} color="black" />,
  ARROWUP: <MaterialIcon name="rotate-right" size={30} color="black" />,
  A: <MaterialIcon name="flip" size={30} color="black" style={tw`rotate-90`} />,
  SHIFT: <MaterialIcon name="check-box-outline-blank" size={30} color="black" />,
  ESCAPE: <MaterialIcon name="transit-enterexit" size={30} color="black" />,
  R: <MaterialIcon name="refresh" size={30} color="black" />,
  T: <MaterialIcon name="chat" size={30} color="black" />,
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
export type CONTROL_VALUE = typeof CONTROLS[CONTROL_TYPE];

export const DEFAULT_CONTROLS: ButtonConfig[] = [
  {
    "color": "lime",
    "id": "6w5c8my",
    "keycode": "ARROWLEFT",
    "position": {
      "x": 45.64861297607422,
      "y": 169.18619537353516
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "orange",
    "id": "eq6oqz0",
    "keycode": "ARROWRIGHT",
    "position": {
      "x": 201.66667938232422,
      "y": 168.33333587646484
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "red",
    "id": "te40bsv",
    "keycode": "CONTROL",
    "position": {
      "x": 450.5714111328125,
      "y": 163.19970703125
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "blue",
    "id": "gwx49ip",
    "keycode": "ARROWDOWN",
    "position": {
      "x": 121.33333587646484,
      "y": 257.6666946411133
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "slate",
    "id": "33v9b6e",
    "keycode": "SPACE",
    "position": {
      "x": 540.2782363891602,
      "y": 250.55145263671875
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "fuchsia",
    "id": "g0sy0qh",
    "keycode": "SHIFT",
    "position": {
      "x": 543.0000114440918,
      "y": 76.33333206176758
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "red",
    "id": "vf16gr7",
    "keycode": "ARROWUP",
    "position": {
      "x": 632.2786064147949,
      "y": 158.81983947753906
    },
    "size": {
      "x": 80,
      "y": 80
    }
  },
  {
    "color": "white",
    "id": "sbgo4ig",
    "keycode": "A",
    "position": {
      "x": 129.00000762939453,
      "y": 75.55564880371094
    },
    "size": {
      "x": 80,
      "y": 80
    }
  }
]