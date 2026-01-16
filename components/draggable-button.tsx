import { useEffect, useRef } from "react";
import { Animated, PanResponder, StyleProp, ViewStyle } from "react-native";
import { CONTROL_TYPE, CONTROL_VALUE, CONTROLS_ELEMENT } from "@/constants/controls";
import tw from "twrnc";

interface DraggableButtonProps {
  /** Size of the button (width and height) */
  size?: number;
  /** Initial X position */
  initialX?: number;
  /** Initial Y position */
  initialY?: number;
  /** Background color class (twrnc format, e.g. "bg-red-500") */
  colorClass?: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** Keycode of the button */
  keycode: CONTROL_VALUE;
  /** Callback when position changes */
  onPositionChange?: (position: { x: number; y: number }) => void;
  /** Callback when button is pressed/selected */
  onPress?: () => void;
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
}

export function DraggableButton({
  size = 50,
  initialX = 0,
  initialY = 0,
  colorClass = "bg-red-500",
  opacity = 0.5,
  keycode,
  onPositionChange,
  onPress,
  style,
}: DraggableButtonProps) {

  // Use a ref to store the current position for the pan responder
  const positionRef = useRef({ x: initialX, y: initialY });

  // Create animated value for smooth dragging
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPress?.();
        pan.setOffset({
          x: positionRef.current.x,
          y: positionRef.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const newX = (pan.x as any)._value;
        const newY = (pan.y as any)._value;
        positionRef.current = { x: newX, y: newY };
        onPositionChange?.({ x: newX, y: newY });
      },
    })
  ).current;

  useEffect(() => {
    pan.setValue({ x: initialX, y: initialY });
    positionRef.current = { x: initialX, y: initialY };
  }, [initialX, initialY, size]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      onTouchStart={() => onPress?.()}
      style={[
        tw`absolute ${colorClass} items-center justify-center`,
        {
          width: size,
          height: size,
          opacity,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
        style,
      ]}
    >
      {CONTROLS_ELEMENT[keycode]}
    </Animated.View>
  );
}