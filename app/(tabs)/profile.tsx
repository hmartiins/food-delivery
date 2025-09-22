import { Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButton, CustomHeader } from '@/components';
import { images } from '@/constants';
import { logout } from '@/lib/appwrite';

export default function Profile() {
  return (
    <SafeAreaView className="h-full bg-white px-5 pb-28 pt-5">
      <CustomHeader title="Profile" />

      <CustomButton
        style="custom-btn-outline mb-5"
        title="Edit Profile"
        textStyle="font-quicksand-bold text-primary"
      />

      <CustomButton
        style="custom-btn-red"
        leftIcon={
          <Image
            source={images.logout}
            className="size-6"
            resizeMode="contain"
          />
        }
        title="Logout"
        textStyle="text-red-500 font-quicksand-bold pl-2"
        onPress={() => logout()}
      />
    </SafeAreaView>
  );
}
