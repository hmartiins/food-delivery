import { Image, ImageSourcePropType, Text, View } from 'react-native';

import { images } from '@/constants';

export const EmptyData = ({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}) => {
  return (
    <View className="flex flex-col items-center justify-center">
      <View className="relative">
        <Image source={images.emptyState} className="mb-8" />

        <View className="absolute inset-0 top-1/2 flex items-center justify-center">
          <View className="flex size-14 items-center justify-center rounded-full bg-primary">
            <Image
              source={image}
              className="size-5 text-white"
              tintColor={'#FFFF'}
              testID="custom-icon"
            />
          </View>
        </View>
      </View>
      <Text
        className="base-bold my-3 text-center text-dark-100"
        testID="empty-data-title"
      >
        {title}
      </Text>
      <Text className="body-regular text-gray-200" testID="empty-data-subtitle">
        {subtitle}
      </Text>
    </View>
  );
};
