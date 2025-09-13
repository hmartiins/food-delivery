import React from 'react';

import { render, screen } from '@testing-library/react-native';

import Cart from '../cart';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('@/components', () => ({
  CartItem: jest.fn(({ item }) => null),
  CustomButton: jest.fn(({ title, testID, onPress }) => null),
  CustomHeader: jest.fn(({ title }) => null),
}));

const mockUseCartStore = jest.fn();
jest.mock('@/stores/cart.store', () => ({
  useCartStore: () => mockUseCartStore(),
}));

describe('Cart Screen', () => {
  const mockItems = [
    {
      id: '1',
      name: 'Burger',
      price: 10.99,
      image_url: 'https://example.com/burger.jpg',
      quantity: 2,
      customizations: [],
    },
    {
      id: '2',
      name: 'Pizza',
      price: 15.5,
      image_url: 'https://example.com/pizza.jpg',
      quantity: 1,
      customizations: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartStore.mockReturnValue({
      items: mockItems,
      getTotalItems: jest.fn(() => mockItems.length),
      getTotalPrice: jest.fn(() =>
        mockItems.reduce((acc, item) => acc + item.price, 0)
      ),
    });
  });

  describe('Basic Rendering', () => {
    it('should render without errors', () => {
      render(<Cart />);
      expect(screen.getByTestId('cart-container')).toBeTruthy();
      expect(screen.getByTestId('cart-list')).toBeTruthy();
    });
  });

  describe('Empty Cart State', () => {
    it('should display empty cart container when no items', () => {
      mockUseCartStore.mockReturnValue({
        items: [],
        getTotalItems: jest.fn(() => 0),
        getTotalPrice: jest.fn(() => 0),
      });

      render(<Cart />);

      expect(screen.getByTestId('empty-cart-container')).toBeTruthy();
    });

    it('should not display payment summary when cart is empty', () => {
      mockUseCartStore.mockReturnValue({
        items: [],
        getTotalItems: jest.fn(() => 0),
        getTotalPrice: jest.fn(() => 0),
      });

      render(<Cart />);
      expect(screen.queryByTestId('cart-footer')).toBeFalsy();
    });
  });

  describe('Cart with Items', () => {
    it('should display payment summary when items exist', () => {
      render(<Cart />);

      expect(screen.getByTestId('payment-summary-title')).toHaveTextContent(
        'Payment Summary'
      );
      expect(screen.getByTestId('cart-footer')).toBeTruthy();
    });

    it('should display correct total items in payment summary', () => {
      render(<Cart />);

      expect(
        screen.getByText(`Total Items (${mockItems.length})`)
      ).toBeTruthy();
      expect(
        screen.getByText(
          `$${mockItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}`
        )
      ).toBeTruthy();
    });

    it('should display delivery fee', () => {
      render(<Cart />);

      expect(screen.getByText('Delivery Fee')).toBeTruthy();
      expect(screen.getByText('$5.00')).toBeTruthy();
    });

    it('should display discount', () => {
      render(<Cart />);

      expect(screen.getByText('Discount')).toBeTruthy();
      expect(screen.getByText('- $0.50')).toBeTruthy();
    });

    it('should calculate and display correct total price', () => {
      render(<Cart />);

      // Total = 37.48 + 5.00 - 0.50 = 41.98
      expect(screen.getByText('Total')).toBeTruthy();
      expect(
        screen.getByText(
          `$${(mockItems.reduce((acc, item) => acc + item.price, 0) + 5 - 0.5).toFixed(2)}`
        )
      ).toBeTruthy();
    });
  });
});

describe('Cart Screen Snapshots', () => {
  it('should match snapshot with empty cart', () => {
    mockUseCartStore.mockReturnValue({
      items: [],
      getTotalItems: jest.fn(() => 0),
      getTotalPrice: jest.fn(() => 0),
    });

    const component = render(<Cart />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with cart items', () => {
    const component = render(<Cart />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
