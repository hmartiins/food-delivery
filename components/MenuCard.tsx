import { useState } from 'react';

import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';

import { images } from '@/constants';
import { useCartStore } from '@/stores/cart.store';
import { MenuItem } from '@/type';

import { BottomSheet } from './BottomSheet';
import { CustomButton } from './CustomButton';

export const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const { addItem } = useCartStore();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  return (
    <TouchableOpacity
      testID="menu-card"
      className="menu-card"
      style={
        Platform.OS === 'android'
          ? { elevation: 10, shadowColor: '#878787' }
          : {}
      }
    >
      <Image
        testID="menu-card-image"
        source={{ uri: image_url }}
        className="absolute -top-10 size-32"
        resizeMode="contain"
      />
      <Text
        testID="menu-card-name"
        className="base-bold mb-2 text-center text-dark-100"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text
        testID="menu-card-price"
        className="body-regular mb-4 text-gray-200"
      >
        From ${price}
      </Text>
      <TouchableOpacity
        testID="add-to-cart-button"
        onPress={() => {
          addItem({ id: $id, image_url, name, price, customizations: [] });
          setBottomSheetVisible(true);
        }}
      >
        <Text className="paragraph-bold text-primary">Add To Cart +</Text>
      </TouchableOpacity>

      {bottomSheetVisible && (
        <BottomSheet onClose={() => setBottomSheetVisible(false)} height={430}>
          <View className="flex-1 items-center px-6">
            <Image
              source={images.success}
              className="size-52"
              resizeMode="contain"
            />

            <Text className="h2-bold mb-2 mt-4 text-center text-dark-100">
              Product Added
            </Text>

            <Text className="body-medium mb-8 text-gray-200">
              You can continue shopping or view your cart
            </Text>

            <CustomButton
              title="Go to Cart"
              onPress={() => {
                setBottomSheetVisible(false);
                router.push('/cart');
              }}
            />
          </View>
        </BottomSheet>
      )}
    </TouchableOpacity>
  );
};
