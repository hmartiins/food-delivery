import { fireEvent, render } from '@testing-library/react-native';

import { CustomInput } from '../CustomInput';

jest.mock('clsx', () =>
  jest.fn(
    (className: string, conditionalClass?: string) =>
      conditionalClass || className
  )
);

describe('<CustomInput />', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => mockOnChangeText.mockClear());

  it('renders correctly with required props only', () => {
    const { getByText, getByDisplayValue } = render(
      <CustomInput label="Email" />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('renders correctly with all props', () => {
    const { getByText, getByDisplayValue } = render(
      <CustomInput
        label="Password"
        value="test123"
        placeholder="Digite sua senha"
        secureTextEntry={true}
        keyboardType="email-address"
        onChangeText={mockOnChangeText}
      />
    );

    expect(getByText('Password')).toBeTruthy();
    expect(getByDisplayValue('test123')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const { getByTestId } = render(
      <CustomInput label="Username" onChangeText={mockOnChangeText} />
    );

    expect(mockOnChangeText).not.toHaveBeenCalled();

    const input = getByTestId('input');
    fireEvent.changeText(input, 'newtext');

    expect(mockOnChangeText).toHaveBeenCalledWith('newtext');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

  it('does not crash when onChangeText is not provided', () => {
    const { getByTestId } = render(<CustomInput label="Test Input" />);

    const input = getByTestId('input');
    expect(() => fireEvent.changeText(input, 'test')).not.toThrow();
    expect(mockOnChangeText).not.toHaveBeenCalled();
  });

  it('handles focus and blur events correctly', () => {
    const { getByTestId } = render(<CustomInput label="Focus Test" />);

    const input = getByTestId('input');

    expect(() => fireEvent(input, 'focus')).not.toThrow();
    expect(() => fireEvent(input, 'blur')).not.toThrow();
  });

  it('renders with default placeholder when not provided', () => {
    const { getByPlaceholderText } = render(
      <CustomInput label="Default Placeholder Test" />
    );

    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders with custom placeholder when provided', () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        label="Custom Placeholder Test"
        placeholder="Enter here..."
      />
    );

    expect(getByPlaceholderText('Enter here...')).toBeTruthy();
  });

  it('applies secureTextEntry when prop is true', () => {
    const { getByTestId } = render(
      <CustomInput label="Password" value="secret" secureTextEntry={true} />
    );

    const input = getByTestId('input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('applies correct keyboardType', () => {
    const { getByTestId } = render(
      <CustomInput label="Email" keyboardType="email-address" />
    );

    const input = getByTestId('input');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies default keyboardType when not provided', () => {
    const { getByTestId } = render(<CustomInput label="Default Keyboard" />);

    const input = getByTestId('input');
    expect(input.props.keyboardType).toBe('default');
  });

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<CustomInput label="Accessibility Test" />);

    const input = getByTestId('input');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
    expect(input.props.placeholderTextColor).toBe('#888');
  });

  it('handles empty string value', () => {
    const { getByTestId } = render(
      <CustomInput
        label="Empty Value Test"
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    expect(getByTestId('input')).toBeTruthy();
  });

  it('handles undefined value gracefully', () => {
    const { getByTestId } = render(
      <CustomInput label="Undefined Value Test" value={undefined} />
    );
    expect(getByTestId('input')).toBeTruthy();
  });

  it('snapshot of the component', () => {
    const { toJSON } = render(
      <CustomInput
        label="Complete Snapshot Test"
        value="test value"
        placeholder="Enter your text"
        secureTextEntry={false}
        keyboardType="numeric"
        onChangeText={mockOnChangeText}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
