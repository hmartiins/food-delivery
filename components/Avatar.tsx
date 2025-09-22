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
      testID="avatar-container"
      className="relative"
      onPress={hasEdit ? onPress : undefined}
    >
      <Image
        testID="avatar-image"
        source={{
          uri: 'https://github.com/hmartiins.png',
        }}
        className="size-24 rounded-full"
        resizeMode="contain"
      />

      {hasEdit && (
        <View
          testID="avatar-edit-badge"
          className="absolute bottom-0 right-0 size-7 rounded-full border border-white-100 bg-primary"
        >
          <Image
            testID="avatar-edit-icon"
            source={images.pencil}
            className="mx-auto my-auto mt-auto size-3"
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
