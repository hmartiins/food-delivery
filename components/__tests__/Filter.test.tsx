import { router, useLocalSearchParams } from 'expo-router';

import { fireEvent, render } from '@testing-library/react-native';

import { Category } from '@/type';

import { Filter } from '../Filter';

jest.mock('expo-router', () => ({
  router: { setParams: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

jest.mock('clsx', () => jest.fn((className: string) => className));

const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;

describe('<Filter />', () => {
  const mockCategories: Category[] = [
    {
      $id: 'cat1',
      name: 'Pizza',
      description: 'Delicious pizza',
      $collectionId: 'collection1',
      $databaseId: 'database1',
      $createdAt: '2024-01-01T00:00:00.000Z',
      $updatedAt: '2024-01-01T00:00:00.000Z',
      $permissions: [],
    },
    {
      $id: 'cat2',
      name: 'Burger',
      description: 'Tasty burgers',
      $collectionId: 'collection1',
      $databaseId: 'database1',
      $createdAt: '2024-01-01T00:00:00.000Z',
      $updatedAt: '2024-01-01T00:00:00.000Z',
      $permissions: [],
    },
    {
      $id: 'cat3',
      name: 'Salad',
      description: 'Fresh salads',
      $collectionId: 'collection1',
      $databaseId: 'database1',
      $createdAt: '2024-01-01T00:00:00.000Z',
      $updatedAt: '2024-01-01T00:00:00.000Z',
      $permissions: [],
    },
  ];

  beforeEach(() => jest.clearAllMocks());

  it('renders correctly with empty categories', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId, getByText } = render(<Filter categories={[]} />);

    expect(getByTestId('filter-list')).toBeTruthy();
    expect(getByTestId('filter-item-all')).toBeTruthy();
    expect(getByText('All')).toBeTruthy();
  });

  it('renders correctly with categories', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId, getByText } = render(
      <Filter categories={mockCategories} />
    );

    expect(getByTestId('filter-list')).toBeTruthy();
    expect(getByTestId('filter-item-all')).toBeTruthy();
    expect(getByTestId('filter-item-cat1')).toBeTruthy();
    expect(getByTestId('filter-item-cat2')).toBeTruthy();
    expect(getByTestId('filter-item-cat3')).toBeTruthy();

    expect(getByText('All')).toBeTruthy();
    expect(getByText(mockCategories[0].name)).toBeTruthy();
    expect(getByText(mockCategories[1].name)).toBeTruthy();
    expect(getByText(mockCategories[2].name)).toBeTruthy();
  });

  it('sets initial active state from search params', () => {
    mockUseLocalSearchParams.mockReturnValue({ category: 'cat1' });

    const { getByTestId } = render(<Filter categories={mockCategories} />);

    const activeItem = getByTestId('filter-item-cat1');
    const inactiveItem = getByTestId('filter-item-all');

    expect(activeItem.props.accessibilityState.selected).toBe(true);
    expect(inactiveItem.props.accessibilityState.selected).toBe(false);
  });

  it('calls router.setParams with undefined when "All" is pressed', () => {
    mockUseLocalSearchParams.mockReturnValue({ category: 'cat1' });

    const { getByTestId } = render(<Filter categories={mockCategories} />);

    const allButton = getByTestId('filter-item-all');
    fireEvent.press(allButton);

    expect(router.setParams).toHaveBeenCalledWith({ category: undefined });
  });

  it('calls router.setParams with category id when category is pressed', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<Filter categories={mockCategories} />);

    const pizzaButton = getByTestId('filter-item-cat1');
    fireEvent.press(pizzaButton);

    expect(router.setParams).toHaveBeenCalledWith({ category: 'cat1' });
  });

  it('updates active state when filter item is pressed', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<Filter categories={mockCategories} />);

    const burgerButton = getByTestId('filter-item-cat2');
    fireEvent.press(burgerButton);

    expect(router.setParams).toHaveBeenCalledWith({ category: 'cat2' });
  });

  it('handles multiple category presses correctly', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<Filter categories={mockCategories} />);

    // Press Pizza
    const pizzaButton = getByTestId('filter-item-cat1');
    fireEvent.press(pizzaButton);
    expect(router.setParams).toHaveBeenCalledWith({ category: 'cat1' });

    // Press Burger
    const burgerButton = getByTestId('filter-item-cat2');
    fireEvent.press(burgerButton);
    expect(router.setParams).toHaveBeenCalledWith({ category: 'cat2' });

    // Press All
    const allButton = getByTestId('filter-item-all');
    fireEvent.press(allButton);
    expect(router.setParams).toHaveBeenCalledWith({ category: undefined });

    expect(router.setParams).toHaveBeenCalledTimes(3);
  });

  describe('Accessibility', () => {
    it('has correct accessibility properties on filter list', () => {
      mockUseLocalSearchParams.mockReturnValue({});

      const { getByTestId } = render(<Filter categories={mockCategories} />);

      const filterList = getByTestId('filter-list');
      expect(filterList.props.accessible).toBe(true);
      expect(filterList.props.accessibilityRole).toBe('tablist');
      expect(filterList.props.accessibilityLabel).toBe('Category filters');
      expect(filterList.props.accessibilityHint).toBe(
        'Swipe horizontally to browse different category filters'
      );
    });

    it('has correct accessibility properties on active filter item', () => {
      mockUseLocalSearchParams.mockReturnValue({ category: 'cat1' });

      const { getByTestId } = render(<Filter categories={mockCategories} />);

      const activeItem = getByTestId('filter-item-cat1');
      expect(activeItem.props.accessible).toBe(true);
      expect(activeItem.props.accessibilityRole).toBe('button');
      expect(activeItem.props.accessibilityState.selected).toBe(true);
      expect(activeItem.props.accessibilityLabel).toBe('Pizza filter');
      expect(activeItem.props.accessibilityHint).toBe(
        'Pizza filter is currently active'
      );
    });

    it('has correct accessibility properties on inactive filter item', () => {
      mockUseLocalSearchParams.mockReturnValue({ category: 'cat1' });

      const { getByTestId } = render(<Filter categories={mockCategories} />);

      const inactiveItem = getByTestId('filter-item-cat2');
      expect(inactiveItem.props.accessible).toBe(true);
      expect(inactiveItem.props.accessibilityRole).toBe('button');
      expect(inactiveItem.props.accessibilityState.selected).toBe(false);
      expect(inactiveItem.props.accessibilityLabel).toBe('Burger filter');
      expect(inactiveItem.props.accessibilityHint).toBe(
        'Tap to filter by Burger'
      );
    });
  });

  it('snapshot test with categories', () => {
    mockUseLocalSearchParams.mockReturnValue({ category: 'cat1' });

    const { toJSON } = render(<Filter categories={mockCategories} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('snapshot test without categories', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { toJSON } = render(<Filter categories={[]} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
