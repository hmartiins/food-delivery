import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import { images } from '@/constants';
import { CustomHeaderProps } from '@/type';

export const CustomHeader = ({ title }: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View className="custom-header">
      <TouchableOpacity onPress={() => router.back()} testID="back-button">
        <Image
          source={images.arrowBack}
          className="size-5"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {title && <Text className="base-semibold text-dark-100">{title}</Text>}

      <TouchableOpacity
        onPress={() => router.push('/search')}
        testID="search-button"
      >
        <Image
          source={images.search}
          className="size-5"
          resizeMode="contain"
          testID="search-icon"
        />
      </TouchableOpacity>
    </View>
  );
};
