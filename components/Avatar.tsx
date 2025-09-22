import { Image, TouchableOpacity, View } from 'react-native';

import { images } from '@/constants';

type AvatarProps = {
  onPress?: () => void;
  hasEdit?: boolean;
};

export const Avatar = ({
  hasEdit = false,
  onPress = () => {},
}: AvatarProps) => {
  return (
    <TouchableOpacity
      className="relative"
      onPress={hasEdit ? onPress : undefined}
    >
      <Image
        source={{
          uri: 'https://github.com/hmartiins.png',
        }}
        className="size-24 rounded-full"
        resizeMode="contain"
      />

      {hasEdit && (
        <View className="absolute bottom-0 right-0 size-7 rounded-full border border-white-100 bg-primary">
          <Image
            source={images.pencil}
            className="mx-auto my-auto mt-auto size-3"
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
