import { router, useLocalSearchParams } from 'expo-router';

import { fireEvent, render } from '@testing-library/react-native';

import { SearchBar } from '../SearchBar';

// Mock do expo-router
jest.mock('expo-router', () => ({
  router: {
    setParams: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

// Mock das constantes
jest.mock('@/constants', () => ({
  images: {
    search: 'search-icon',
  },
}));

const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;
describe('<SearchBar />', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders correctly with empty query', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByPlaceholderText, getByTestId } = render(<SearchBar />);

    expect(getByPlaceholderText('Search for pizzas, burgers...')).toBeTruthy();
    expect(getByTestId('search-button')).toBeTruthy();
  });

  it('renders correctly with initial query from params', () => {
    mockUseLocalSearchParams.mockReturnValue({ query: 'pizza' });

    const { getByDisplayValue } = render(<SearchBar />);

    expect(getByDisplayValue('pizza')).toBeTruthy();
  });

  it('updates query state when text input changes', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const textInput = getByTestId('search-input');

    fireEvent.changeText(textInput, 'burger');

    expect(textInput.props.value).toBe('burger');
  });

  it('calls router.setParams with undefined when text is cleared', () => {
    mockUseLocalSearchParams.mockReturnValue({ query: 'pizza' });

    const { getByDisplayValue } = render(<SearchBar />);
    const textInput = getByDisplayValue('pizza');

    fireEvent.changeText(textInput, '');

    expect(router.setParams).toHaveBeenCalledWith({ query: undefined });
  });

  it('calls router.setParams with query on submit editing when query has content', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const textInput = getByTestId('search-input');

    fireEvent.changeText(textInput, 'burger');
    fireEvent(textInput, 'submitEditing');

    expect(router.setParams).toHaveBeenCalledWith({ query: 'burger' });
  });

  it('does not call router.setParams on submit editing when query is empty', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const textInput = getByTestId('search-input');

    fireEvent(textInput, 'submitEditing');

    expect(router.setParams).not.toHaveBeenCalled();
  });

  it('does not call router.setParams on submit editing when query is only whitespace', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const textInput = getByTestId('search-input');

    fireEvent.changeText(textInput, '   ');
    fireEvent(textInput, 'submitEditing');

    expect(router.setParams).not.toHaveBeenCalled();
  });

  it('calls router.setParams when search button is pressed', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const textInput = getByTestId('search-input');
    const searchButton = getByTestId('search-button');

    fireEvent.changeText(textInput, 'pizza');
    fireEvent.press(searchButton);

    expect(router.setParams).toHaveBeenCalledWith({ query: 'pizza' });
  });

  it('calls router.setParams with empty string when search button is pressed with empty query', () => {
    mockUseLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<SearchBar />);
    const searchButton = getByTestId('search-button');

    fireEvent.press(searchButton);

    expect(router.setParams).toHaveBeenCalledWith({ query: '' });
  });

  it('snapshot test', () => {
    mockUseLocalSearchParams.mockReturnValue({ query: 'test query' });

    const { toJSON } = render(<SearchBar />);
    expect(toJSON()).toMatchSnapshot();
  });
});
