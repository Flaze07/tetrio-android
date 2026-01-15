export const CONTROLS = {
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
  target1: "1",
  target2: "2",
  target3: "3",
  target4: "4",
  menuUp: "W",
  menuDown: "S",
  menuLeft: "A",
  menuRight: "D",
  menuBack: "ESCAPE",
  menuConfirm: "ENTER",
  openSocial: "TAB",
};

export const CONTROLS_LIST = Object.entries(CONTROLS).map(([key, value]) => ({
  key,
  value,
}));
