import { FlatList, Text, View } from 'react-native';

import cn from 'clsx';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItem, CustomButton, CustomHeader } from '@/components';
import { useCartStore } from '@/stores/cart.store';
import { PaymentInfoStripeProps } from '@/type';

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between my-1 flex-row">
    <Text className={cn('paragraph-medium text-gray-200', labelStyle)}>
      {label}
    </Text>
    <Text className={cn('paragraph-bold text-dark-100', valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => <Text>Cart Empty</Text>}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 rounded-2xl border border-gray-200 p-5">
                <Text className="h3-bold mb-5 text-dark-100">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
                <PaymentInfoStripe
                  label={`Discount`}
                  value={`- $0.50`}
                  valueStyle="!text-success"
                />
                <View className="my-2 border-t border-gray-300" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              <CustomButton title="Order Now" />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
