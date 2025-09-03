import { Image, Platform, Text, TouchableOpacity } from 'react-native';

import { useCartStore } from '@/stores/cart.store';
import { MenuItem } from '@/type';

export const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const { addItem } = useCartStore();

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === 'android'
          ? { elevation: 10, shadowColor: '#878787' }
          : {}
      }
    >
      <Image
        source={{ uri: image_url }}
        className="absolute -top-10 size-32"
        resizeMode="contain"
      />
      <Text
        className="base-bold mb-2 text-center text-dark-100"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular mb-4 text-gray-200">From ${price}</Text>
      <TouchableOpacity
        onPress={() =>
          addItem({ id: $id, image_url, name, price, customizations: [] })
        }
      >
        <Text className="paragraph-bold text-primary">Add To Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
