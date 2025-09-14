import { Text, View } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { usePortalStore } from '@/stores/portal.store';

import { PortalProvider } from '../PortalProvider';

jest.mock('@/stores/portal.store');
const mockUsePortalStore = usePortalStore as jest.MockedFunction<
  typeof usePortalStore
>;

describe('<PortalProvider />', () => {
  const mockGetComponents = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePortalStore.mockReturnValue({ getComponents: mockGetComponents });
  });

  it('should render without errors', () => {
    mockGetComponents.mockReturnValue([]);

    render(
      <PortalProvider>
        <Text testID="child-component">Child component</Text>
      </PortalProvider>
    );

    expect(screen.getByTestId('child-component')).toBeTruthy();
    expect(screen.getByText('Child component')).toBeTruthy();
  });

  it('should render child components correctly', () => {
    mockGetComponents.mockReturnValue([]);

    render(
      <PortalProvider>
        <View testID="wrapper">
          <Text testID="first-child">First child</Text>
          <Text testID="second-child">Second child</Text>
        </View>
      </PortalProvider>
    );

    expect(screen.getByTestId('wrapper')).toBeTruthy();
    expect(screen.getByTestId('first-child')).toBeTruthy();
    expect(screen.getByTestId('second-child')).toBeTruthy();
    expect(screen.getByText('First child')).toBeTruthy();
    expect(screen.getByText('Second child')).toBeTruthy();
  });

  it('should render portal components when they exist', () => {
    const portalComponent1 = <Text testID="portal-component-1">Portal 1</Text>;
    const portalComponent2 = <Text testID="portal-component-2">Portal 2</Text>;

    mockGetComponents.mockReturnValue([
      ['modal-1', portalComponent1],
      ['modal-2', portalComponent2],
    ]);

    render(
      <PortalProvider>
        <Text testID="main-content">Main content</Text>
      </PortalProvider>
    );

    expect(screen.getByTestId('main-content')).toBeTruthy();
    expect(screen.getByText('Main content')).toBeTruthy();

    expect(screen.getByTestId('portal-component-1')).toBeTruthy();
    expect(screen.getByTestId('portal-component-2')).toBeTruthy();
    expect(screen.getByText('Portal 1')).toBeTruthy();
    expect(screen.getByText('Portal 2')).toBeTruthy();
  });

  it('should not break when there are no portal components', () => {
    mockGetComponents.mockReturnValue([]);

    expect(() => {
      render(
        <PortalProvider>
          <Text testID="safe-content">Safe content</Text>
        </PortalProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('safe-content')).toBeTruthy();
  });

  it('should call getComponents from the portal store', () => {
    mockGetComponents.mockReturnValue([]);

    render(
      <PortalProvider>
        <Text>Test</Text>
      </PortalProvider>
    );

    expect(mockGetComponents).toHaveBeenCalledTimes(1);
  });

  it('should render multiple portal components with unique names', () => {
    const component1 = (
      <View testID="portal-view-1">
        <Text>Portal 1</Text>
      </View>
    );
    const component2 = (
      <View testID="portal-view-2">
        <Text>Portal 2</Text>
      </View>
    );
    const component3 = (
      <View testID="portal-view-3">
        <Text>Portal 3</Text>
      </View>
    );

    mockGetComponents.mockReturnValue([
      ['unique-modal', component1],
      ['bottom-sheet-portal', component2],
      ['toast-notification', component3],
    ]);

    render(
      <PortalProvider>
        <Text testID="app-content">App</Text>
      </PortalProvider>
    );

    expect(screen.getByTestId('app-content')).toBeTruthy();
    expect(screen.getByTestId('portal-view-1')).toBeTruthy();
    expect(screen.getByTestId('portal-view-2')).toBeTruthy();
    expect(screen.getByTestId('portal-view-3')).toBeTruthy();
    expect(screen.getByText('Portal 1')).toBeTruthy();
    expect(screen.getByText('Portal 2')).toBeTruthy();
    expect(screen.getByText('Portal 3')).toBeTruthy();
  });
});
