import { Text, View } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';

import { CustomButton } from '../CustomButton';

jest.mock('clsx', () => jest.fn((className: string) => className));

describe('<CustomButton />', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => mockOnPress.mockClear());

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const { getByText } = render(
      <CustomButton title="Press Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onPress is not provided', () => {
    const { getByText } = render(<CustomButton title="No Handler" />);

    expect(() => fireEvent.press(getByText('No Handler'))).not.toThrow();
  });

  it('shows ActivityIndicator when isLoading is true', () => {
    const { queryByText, getByTestId } = render(
      <CustomButton
        title="Loading Button"
        isLoading={true}
        onPress={mockOnPress}
      />
    );

    expect(queryByText('Loading Button')).toBeNull();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows title when isLoading is false', () => {
    const { getByText } = render(
      <CustomButton
        title="Normal Button"
        isLoading={false}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Normal Button')).toBeTruthy();
  });

  it('renders with leftIcon', () => {
    const TestIcon = () => <Text testID="test-icon">Icon</Text>;

    const { getByTestId, getByText } = render(
      <CustomButton
        title="Button with Icon"
        leftIcon={<TestIcon />}
        onPress={mockOnPress}
      />
    );

    expect(getByTestId('test-icon')).toBeTruthy();
    expect(getByText('Button with Icon')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const TestIcon = () => (
      <View testID="complex-icon">
        <Text>📱</Text>
      </View>
    );

    const { getByText, getByTestId } = render(
      <CustomButton
        title="Complex Button"
        style="complex-style"
        textStyle="complex-text-style"
        leftIcon={<TestIcon />}
        isLoading={false}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Complex Button')).toBeTruthy();
    expect(getByTestId('complex-icon')).toBeTruthy();
  });
});
