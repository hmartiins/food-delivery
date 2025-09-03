import { CustomButtonProps } from '@/type';
import cn from 'clsx';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

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
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className={cn('paragraph-semibold text-white-100', textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
