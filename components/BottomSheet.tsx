import React from 'react';

import { Dimensions, Text } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SlideInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const sheetHeight = 220;
const sheetOverDrag = 20;

type Props = {
  onClose: () => void;
};

export const BottomSheet = ({ onClose }: Props) => {
  const offset = useSharedValue(0);

  function close() {
    offset.value = 0;
    onClose();
  }

  const gesture = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-sheetOverDrag, offsetDelta);

      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < sheetHeight / 2) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(sheetHeight, {}, () => runOnJS(close)());
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={SlideInDown.springify().damping(15)}
        className={`absolute left-0 right-0 z-50 bg-primary`}
        style={[
          {
            width,
            height: sheetHeight,
            bottom: -sheetOverDrag * 1.3,
          },
          translateY,
        ]}
      >
        <MaterialIcons
          className="mt-4 self-center"
          name="drag-handle"
          size={24}
          color="white"
        />
        <Text>BottomSheet</Text>
      </Animated.View>
    </GestureDetector>
  );
};
