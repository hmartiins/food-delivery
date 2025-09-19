import { ReactNode } from 'react';

import { Dimensions, Pressable } from 'react-native';

import { BlurView } from 'expo-blur';

import { MaterialIcons } from '@expo/vector-icons';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Portal } from './Portal';

const { width } = Dimensions.get('window');
const sheetOverDrag = 20;

type Props = {
  height: number;
  children: ReactNode;
  onClose: () => void;
};

export const BottomSheet = ({ onClose, children, height }: Props) => {
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
      if (offset.value < height / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(height, {}, () => runOnJS(close)());
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Portal name="bottom-sheet">
      <Animated.View
        testID="bottom-sheet-overlay"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="absolute inset-0 z-40"
      >
        <BlurView
          testID="blur-view"
          intensity={20}
          tint="dark"
          className="flex-1"
        >
          <Pressable
            testID="bottom-sheet-backdrop"
            className="flex-1 bg-black/20"
            onPress={onClose}
          />
        </BlurView>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          testID="bottom-sheet-container"
          entering={SlideInDown.springify()}
          className={`absolute left-0 right-0 z-50 rounded-t-3xl bg-white`}
          style={[
            {
              width,
              height,
              bottom: -sheetOverDrag * 1.3,
            },
            translateY,
          ]}
        >
          <MaterialIcons
            testID="bottom-sheet-handle"
            className="mt-0 self-center"
            name="horizontal-rule"
            color="gray"
            size={24}
          />
          {children}
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
};
