import { fireEvent, render } from '@testing-library/react-native';

import { CustomHeader } from '../CustomHeader';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

jest.mock('@/constants', () => ({
  images: {
    arrowBack: 'arrow-back-icon',
    search: 'search-icon',
  },
}));

describe('<CustomHeader />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly without title', () => {
    const { getByTestId, root } = render(<CustomHeader />);

    const textElements = root.findAllByType('Text');
    expect(textElements).toHaveLength(0);

    expect(getByTestId('back-button')).toBeTruthy();
    expect(getByTestId('search-button')).toBeTruthy();
  });

  test('renders correctly with title', () => {
    const { getByText } = render(<CustomHeader title="My Title" />);
    expect(getByText('My Title')).toBeTruthy();
  });

  test('calls router.back when back button is pressed', () => {
    const { getByTestId } = render(<CustomHeader title="Test" />);
    const backButton = getByTestId('back-button');

    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('calls router.push with /search when search button is pressed', () => {
    const { getByTestId } = render(<CustomHeader title="Test" />);
    const searchButton = getByTestId('search-button');

    fireEvent.press(searchButton);

    expect(mockPush).toHaveBeenCalledWith('/search');
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  test('handles empty string title correctly', () => {
    const { queryByText } = render(<CustomHeader title="" />);
    expect(queryByText('')).toBeNull();
  });

  test('snapshot of the component', () => {
    const { toJSON } = render(<CustomHeader title="Header Snapshot Test" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
