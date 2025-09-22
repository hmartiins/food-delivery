import { CartCustomization, CartItemType } from '@/type';

export const mockItem1: Omit<CartItemType, 'quantity'> = {
  id: 'item1',
  name: 'Burger',
  price: 10.99,
  image_url: 'https://example.com/burger.jpg',
};

export const mockItem2: Omit<CartItemType, 'quantity'> = {
  id: 'item2',
  name: 'Pizza',
  price: 15.5,
  image_url: 'https://example.com/pizza.jpg',
};

export const mockCustomization1: CartCustomization = {
  id: 'custom1',
  name: 'Extra Cheese',
  price: 2,
  type: 'addon',
};

export const mockCustomization2: CartCustomization = {
  id: 'custom2',
  name: 'Bacon',
  price: 3.5,
  type: 'addon',
};

export const mockCustomization3: CartCustomization = {
  id: 'custom3',
  name: 'No Onions',
  price: 0,
  type: 'removal',
};

export const itemWithCustomizations = {
  ...mockItem1,
  customizations: [mockCustomization1, mockCustomization2],
};
