import { COLOR_NAME_TO_CLASS } from "@/constants/colors";
import { CONTROLS_ELEMENT } from "@/constants/controls";
import { ButtonConfig } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import tw from "twrnc";

interface Props {
  button: ButtonConfig;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export function GameButton(props: Props) {
  const {
    button,
    onPressIn,
    onPressOut,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const color = COLOR_NAME_TO_CLASS[button.color];

  // Keep latest callbacks in refs so the gesture can stay stable across
  // re-renders (re-creating it mid-press could drop the touch-up event and
  // leave the button stuck in its "pressed" look).
  const onPressInRef = useRef(onPressIn);
  const onPressOutRef = useRef(onPressOut);
  onPressInRef.current = onPressIn;
  onPressOutRef.current = onPressOut;

  const pressedRef = useRef(false);

  const pressIn = () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    setIsPressed(true);
    onPressInRef.current?.();
  };

  const pressOut = () => {
    if (!pressedRef.current) return;
    pressedRef.current = false;
    setIsPressed(false);
    onPressOutRef.current?.();
  };

  // Release if the button unmounts while pressed.
  useEffect(() => {
    return () => {
      if (pressedRef.current) {
        pressedRef.current = false;
        onPressOutRef.current?.();
      }
    };
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Manual()
        .runOnJS(true)
        .onTouchesDown((event, stateManager) => {
          stateManager.begin();
          stateManager.activate();
          if (event.changedTouches.length > 0) {
            pressIn();
          }
        })
        .onTouchesUp((event, stateManager) => {
          const remaining = event.allTouches.filter(
            (t) => !event.changedTouches.some((c) => c.id === t.id)
          );
          if (remaining.length === 0) {
            pressOut();
            stateManager.end();
          }
        })
        .onTouchesCancelled((_event, stateManager) => {
          pressOut();
          stateManager.end();
        })
        .onFinalize(() => {
          pressOut();
        }),
    []
  );

    const opacity = button.opacity ?? 1;

    return (
      <GestureDetector gesture={gesture}>
        <View
          style={[
            tw`absolute ${color} items-center justify-center`,
            {
              width: button.size.x,
              height: button.size.y,

              opacity: isPressed
                ? Math.max(0.2, opacity - 0.4)
                : opacity,

            transform: [
              {
                translateX: button.position.x,
              },
              {
                translateY: button.position.y,
              },
              {
                rotate:
                  button.shape === "SQUARE"
                    ? "0deg"
                    : "45deg",
              },
            ],
          },
        ]}
      >
        {CONTROLS_ELEMENT[button.keycode]}
      </View>
    </GestureDetector>
  );
}