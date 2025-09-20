import { fireEvent, render } from '@testing-library/react-native';

import { renderWithPortal } from '@/helpers';
import { MenuItem } from '@/type';

import { MenuCard } from '../MenuCard';

const mockAddItem = jest.fn();

jest.mock('@/stores/cart.store', () => ({
  useCartStore: () => ({
    addItem: mockAddItem,
  }),
}));

describe('<MenuCard />', () => {
  const mockMenuItem: MenuItem = {
    $id: '123',
    name: 'Delicious Burger',
    price: 15.99,
    image_url: 'https://example.com/burger.jpg',
    description: 'A tasty burger with fresh ingredients',
    calories: 450,
    protein: 25,
    rating: 4.5,
    type: 'main',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $permissions: [],
    $databaseId: 'db123',
    $collectionId: 'collection123',
  };

  beforeEach(() => mockAddItem.mockClear());

  it('renders correctly with menu item data using testId', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);

    expect(getByTestId('menu-card')).toBeTruthy();
    expect(getByTestId('menu-card-image')).toBeTruthy();
    expect(getByTestId('menu-card-name')).toBeTruthy();
    expect(getByTestId('menu-card-price')).toBeTruthy();
    expect(getByTestId('add-to-cart-button')).toBeTruthy();
  });

  it('displays menu item name correctly', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const nameElement = getByTestId('menu-card-name');

    expect(nameElement.props.children).toBe('Delicious Burger');
  });

  it('displays menu item price correctly', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const priceElement = getByTestId('menu-card-price');

    expect(priceElement.props.children).toEqual(['From $', 15.99]);
  });

  it('displays menu item image with correct source', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const imageElement = getByTestId('menu-card-image');

    expect(imageElement.props.source).toEqual({
      uri: 'https://example.com/burger.jpg',
    });
  });

  it('calls addItem when add to cart button is pressed', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const addButton = getByTestId('add-to-cart-button');

    fireEvent.press(addButton);

    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith({
      id: '123',
      image_url: 'https://example.com/burger.jpg',
      name: 'Delicious Burger',
      price: 15.99,
      customizations: [],
    });
  });

  it('handles long menu item names correctly', () => {
    const longNameItem: MenuItem = {
      ...mockMenuItem,
      name: 'This is a very long menu item name that should be truncated',
    };

    const { getByTestId } = render(<MenuCard item={longNameItem} />);
    const nameElement = getByTestId('menu-card-name');

    expect(nameElement.props.numberOfLines).toBe(1);
    expect(nameElement.props.children).toBe(
      'This is a very long menu item name that should be truncated'
    );
  });

  it('handles decimal prices correctly', () => {
    const decimalPriceItem: MenuItem = {
      ...mockMenuItem,
      price: 12.5,
    };

    const { getByTestId } = render(<MenuCard item={decimalPriceItem} />);
    const priceElement = getByTestId('menu-card-price');

    expect(priceElement.props.children).toEqual(['From $', 12.5]);
  });

  it('handles zero price correctly', () => {
    const freePriceItem: MenuItem = {
      ...mockMenuItem,
      price: 0,
    };

    const { getByTestId } = render(<MenuCard item={freePriceItem} />);
    const priceElement = getByTestId('menu-card-price');

    expect(priceElement.props.children).toEqual(['From $', 0]);
  });

  it('verifies menu card container exists and is pressable', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const menuCard = getByTestId('menu-card');

    expect(menuCard).toBeTruthy();
    expect(() => fireEvent.press(menuCard)).not.toThrow();
  });

  it('handles empty string image_url gracefully', () => {
    const emptyImageItem: MenuItem = {
      ...mockMenuItem,
      image_url: '',
    };

    const { getByTestId } = render(<MenuCard item={emptyImageItem} />);
    const imageElement = getByTestId('menu-card-image');

    expect(imageElement.props.source).toEqual({ uri: '' });
  });

  it('multiple button presses call addItem multiple times', () => {
    const { getByTestId } = render(<MenuCard item={mockMenuItem} />);
    const addButton = getByTestId('add-to-cart-button');

    fireEvent.press(addButton);
    fireEvent.press(addButton);
    fireEvent.press(addButton);

    expect(mockAddItem).toHaveBeenCalledTimes(3);
  });

  it('does not show bottom sheet initially', () => {
    const { queryByTestId } = render(<MenuCard item={mockMenuItem} />);

    expect(queryByTestId('bottom-sheet-container')).toBeNull();
  });

  it('shows bottom sheet after pressing add to cart button', () => {
    const { getByTestId, queryByTestId, getByText } = renderWithPortal(
      <MenuCard item={mockMenuItem} />
    );
    const addButton = getByTestId('add-to-cart-button');

    expect(queryByTestId('bottom-sheet-container')).toBeNull();

    fireEvent.press(addButton);

    expect(getByTestId('bottom-sheet-container')).toBeTruthy();

    expect(getByText('Product Added')).toBeTruthy();
    expect(
      getByText('You can continue shopping or view your cart')
    ).toBeTruthy();
    expect(getByText('Go to Cart')).toBeTruthy();
  });

  it('snapshot of the component', () => {
    const { toJSON } = render(<MenuCard item={mockMenuItem} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('snapshot of the component with bottom sheet open', () => {
    const { getByTestId, toJSON } = render(<MenuCard item={mockMenuItem} />);
    const addButton = getByTestId('add-to-cart-button');

    fireEvent.press(addButton);

    expect(toJSON()).toMatchSnapshot();
  });
});
