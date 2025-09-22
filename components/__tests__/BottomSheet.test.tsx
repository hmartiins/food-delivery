import { Text, View } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { renderWithPortal } from '@/helpers';

import { BottomSheet } from '../BottomSheet';
import { PortalProvider } from '../PortalProvider';

jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
  runOnJS: jest.fn(fn => fn),
}));

jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: jest.fn(() => ({
        onChange: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      })),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: (props: any) => 'MockedMaterialIcon',
}));

describe('<BottomSheet />', () => {
  const defaultProps = {
    height: 400,
    onClose: jest.fn(),
    children: <Text testID="test-content">Test Content</Text>,
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Rendering', () => {
    it('should render without errors', () => {
      renderWithPortal(<BottomSheet {...defaultProps} />);

      expect(screen.getByTestId('bottom-sheet-overlay')).toBeTruthy();
      expect(screen.getByTestId('bottom-sheet-container')).toBeTruthy();
      expect(screen.getByTestId('bottom-sheet-backdrop')).toBeTruthy();
    });

    it('should render children correctly', () => {
      renderWithPortal(<BottomSheet {...defaultProps} />);

      expect(screen.getByTestId('test-content')).toBeTruthy();
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    it('should render with different children', () => {
      const customChildren = (
        <View testID="custom-content">
          <Text>Custom Title</Text>
          <Text>Custom Subtitle</Text>
        </View>
      );

      renderWithPortal(
        <BottomSheet {...defaultProps}>{customChildren}</BottomSheet>
      );

      expect(screen.getByTestId('custom-content')).toBeTruthy();
      expect(screen.getByText('Custom Title')).toBeTruthy();
      expect(screen.getByText('Custom Subtitle')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should use correct height prop', () => {
      const customHeight = 600;
      renderWithPortal(<BottomSheet {...defaultProps} height={customHeight} />);

      const container = screen.getByTestId('bottom-sheet-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            height: customHeight,
          }),
        ])
      );
    });

    it('should handle different height values', () => {
      const heights = [200, 400, 600, 800];

      heights.forEach(height => {
        const { unmount } = renderWithPortal(
          <BottomSheet {...defaultProps} height={height} />
        );

        const container = screen.getByTestId('bottom-sheet-container');
        expect(container.props.style).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              height,
            }),
          ])
        );

        unmount();
      });
    });
  });

  describe('Interactions', () => {
    it('should call onClose when backdrop is pressed', async () => {
      const mockOnClose = jest.fn();
      renderWithPortal(<BottomSheet {...defaultProps} onClose={mockOnClose} />);

      const backdrop = screen.getByTestId('bottom-sheet-backdrop');
      await act(async () => fireEvent.press(backdrop));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when container is pressed', async () => {
      const mockOnClose = jest.fn();
      renderWithPortal(<BottomSheet {...defaultProps} onClose={mockOnClose} />);

      const container = screen.getByTestId('bottom-sheet-container');
      await act(async () => fireEvent.press(container));

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when children are pressed', async () => {
      const mockOnClose = jest.fn();
      renderWithPortal(<BottomSheet {...defaultProps} onClose={mockOnClose} />);

      const content = screen.getByTestId('test-content');
      await act(async () => fireEvent.press(content));

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

describe('<BottomSheet /> Snapshots', () => {
  const defaultProps = {
    height: 400,
    onClose: jest.fn(),
    children: <Text testID="test-content">Test Content</Text>,
  };

  it('should match snapshot with default props', () => {
    const component = render(
      <PortalProvider>
        <BottomSheet {...defaultProps} />
      </PortalProvider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with different height', () => {
    const component = render(
      <PortalProvider>
        <BottomSheet {...defaultProps} height={600} />
      </PortalProvider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with complex children', () => {
    const complexChildren = (
      <View testID="complex-content">
        <Text>Title</Text>
        <Text>Subtitle</Text>
        <View testID="nested-view">
          <Text>Nested content</Text>
        </View>
      </View>
    );

    const component = render(
      <PortalProvider>
        <BottomSheet {...defaultProps}>{complexChildren}</BottomSheet>
      </PortalProvider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
