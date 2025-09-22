import { Image, Text, View } from 'react-native';

import { images } from '@/constants';

interface ProfileItemProps {
  icon: any;
  label: string;
  value: string;
}

const ProfileItem = ({ icon, label, value }: ProfileItemProps) => (
  <View className="mb-6 flex-row items-center">
    <View className="mr-4 size-12 items-center justify-center rounded-full bg-orange-50">
      <Image source={icon} className="size-5" resizeMode="contain" />
    </View>
    <View className="flex-1">
      <Text className="mb-1 font-quicksand-medium text-sm text-gray-500">
        {label}
      </Text>
      <Text className="font-quicksand-semibold text-base text-gray-900">
        {value}
      </Text>
    </View>
  </View>
);

export const ProfileInfo = () => {
  return (
    <View className="mx-5 my-8 w-full rounded-2xl bg-white px-4 py-5">
      <ProfileItem
        icon={images.user}
        label="Full Name"
        value="Henrique Martins"
      />

      <ProfileItem
        icon={images.envelope}
        label="Email"
        value="henrique@gmail.com"
      />

      <ProfileItem
        icon={images.phone}
        label="Phone Number"
        value="+55 11 99999-9999"
      />

      <ProfileItem
        icon={images.home}
        label="Address 1 - (Home)"
        value="Rua dos Bobos, 0, São Paulo, SP"
      />

      <ProfileItem
        icon={images.location}
        label="Address 2 - (Work)"
        value="Rua dos Bobos, 0, São Paulo, SP"
      />
    </View>
  );
};
