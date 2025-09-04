import { fireEvent, render } from '@testing-library/react-native';

import { CartItemType } from '@/type';

import { CartItem } from '../CartItem';

const mockIncreaseQty = jest.fn();
const mockDecreaseQty = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('@/stores/cart.store', () => ({
  useCartStore: () => ({
    increaseQty: mockIncreaseQty,
    decreaseQty: mockDecreaseQty,
    removeItem: mockRemoveItem,
  }),
}));

jest.mock('@/constants', () => ({
  images: {
    minus: 'minus-icon',
    plus: 'plus-icon',
    trash: 'trash-icon',
  },
}));

describe('<CartItem />', () => {
  const mockItem: CartItemType = {
    id: 'test-item-1',
    name: 'Burger Deluxe',
    price: 15.99,
    image_url: 'https://example.com/burger.jpg',
    quantity: 2,
    customizations: [
      {
        id: 'custom-1',
        name: 'Extra Cheese',
        price: 1.5,
        type: 'topping',
      },
    ],
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders correctly the item information', () => {
    const { getByText } = render(<CartItem item={mockItem} />);

    expect(getByText('Burger Deluxe')).toBeTruthy();
    expect(getByText('$15.99')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  test('renders the product image correctly', () => {
    const { root } = render(<CartItem item={mockItem} />);
    const images = root.findAllByType('Image');
    const productImage = images[0];

    expect(productImage.props.source).toEqual({
      uri: 'https://example.com/burger.jpg',
    });
  });

  test('works correctly with item without customizations', () => {
    const itemWithoutCustomizations: CartItemType = {
      id: 'simple-item',
      name: 'Simple Burger',
      price: 12.99,
      image_url: 'https://example.com/simple-burger.jpg',
      quantity: 1,
    };

    const { getByText } = render(<CartItem item={itemWithoutCustomizations} />);

    expect(getByText('Simple Burger')).toBeTruthy();
    expect(getByText('$12.99')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  test('renders all icons correctly', () => {
    const { root } = render(<CartItem item={mockItem} />);
    const images = root.findAllByType('Image');

    expect(images[0].props.source).toEqual({
      uri: 'https://example.com/burger.jpg',
    });

    expect(images[1].props.source).toBe('minus-icon');
    expect(images[2].props.source).toBe('plus-icon');
    expect(images[3].props.source).toBe('trash-icon');
  });

  test('snapshot of the component', () => {
    const { toJSON } = render(<CartItem item={mockItem} />);
    expect(toJSON()).toMatchSnapshot();
  });

  test('calls increaseQty when plus button is pressed', () => {
    const { getByTestId } = render(<CartItem item={mockItem} />);
    const plusButton = getByTestId('increase-qty-button');

    fireEvent.press(plusButton);

    expect(mockIncreaseQty).toHaveBeenCalledWith(
      mockItem.id,
      mockItem.customizations
    );
    expect(mockIncreaseQty).toHaveBeenCalledTimes(1);
  });

  test('calls decreaseQty when minus button is pressed', () => {
    const { getByTestId } = render(<CartItem item={mockItem} />);
    const minusButton = getByTestId('decrease-qty-button');

    fireEvent.press(minusButton);

    expect(mockDecreaseQty).toHaveBeenCalledWith(
      mockItem.id,
      mockItem.customizations
    );
    expect(mockDecreaseQty).toHaveBeenCalledTimes(1);
  });

  test('calls removeItem when trash button is pressed', () => {
    const { getByTestId } = render(<CartItem item={mockItem} />);
    const trashButton = getByTestId('remove-item-button');

    fireEvent.press(trashButton);

    expect(mockRemoveItem).toHaveBeenCalledWith(
      mockItem.id,
      mockItem.customizations
    );
    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
  });
});
