import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function _Layout() {
  return (
    <SafeAreaView>
      <Slot />
    </SafeAreaView>
  );
}
