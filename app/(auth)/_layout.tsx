import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { Redirect, Slot } from 'expo-router';

import { images } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="h-full bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="relative w-full"
          style={{ height: Dimensions.get('screen').height / 2.25 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className="h-full rounded-b-lg"
            resizeMode="stretch"
          />
          <ImageBackground
            source={images.logo}
            className="absolute -bottom-16 z-10 size-48 self-center"
            resizeMode="stretch"
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
