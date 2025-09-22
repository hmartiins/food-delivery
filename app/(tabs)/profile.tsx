import { View } from 'react-native';

import { CustomButton } from '@/components';
import { logout } from '@/lib/appwrite';

export default function Profile() {
  return (
    <View className="flex h-full items-center justify-center bg-white">
      <CustomButton title="Logout" onPress={() => logout()} />
    </View>
  );
}
