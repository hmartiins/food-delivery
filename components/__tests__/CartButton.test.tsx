import { render } from '@testing-library/react-native';

import { CartButton } from '../CartButton';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const mockGetTotalItems = jest.fn();
jest.mock('@/stores/cart.store', () => ({
  useCartStore: () => ({
    getTotalItems: mockGetTotalItems,
  }),
}));

describe('<CartButton />', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders cart button without badge when there are no items', () => {
    mockGetTotalItems.mockReturnValue(0);

    const { toJSON, queryByTestId } = render(<CartButton />);

    expect(toJSON()).toBeTruthy();
    expect(queryByTestId('cart-badge')).toBeNull();
  });

  test('renders badge when there are items in the cart', () => {
    mockGetTotalItems.mockReturnValue(3);

    const { getByText, queryByTestId } = render(<CartButton />);

    expect(getByText('3')).toBeTruthy();
    expect(queryByTestId('cart-badge')).toBeTruthy();
  });
});
