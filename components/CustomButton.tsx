import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import cn from 'clsx';

import { CustomButtonProps } from '@/type';

export const CustomButton = ({
  onPress,
  title,
  style,
  leftIcon,
  textStyle,
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} className={cn('custom-btn', style)}>
      {leftIcon}
      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator
            testID="loading-indicator"
            size="small"
            color="#fff"
          />
        ) : (
          <Text className={cn('paragraph-semibold text-white-100', textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
