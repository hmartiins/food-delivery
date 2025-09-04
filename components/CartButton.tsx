import { Image, Text, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';

import { images } from '@/constants';
import { useCartStore } from '@/stores/cart.store';

export const CartButton = () => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity className="cart-btn" onPress={() => router.push('/cart')}>
      <Image source={images.bag} className="size-5" resizeMode="contain" />
      {totalItems > 0 && (
        <View testID="cart-badge" className="cart-badge">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
