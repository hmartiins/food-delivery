import React from 'react';

import { Text } from 'react-native';

import { cleanup, render } from '@testing-library/react-native';

import { usePortalStore } from '@/stores/portal.store';

import { Portal } from '../Portal';

jest.mock('@/stores/portal.store', () => ({ usePortalStore: jest.fn() }));

const mockUsePortalStore = usePortalStore as jest.MockedFunction<
  typeof usePortalStore
>;

describe('<Portal />', () => {
  const mockAddComponent = jest.fn();
  const mockRemoveComponent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePortalStore.mockReturnValue({
      components: {},
      addComponent: mockAddComponent,
      removeComponent: mockRemoveComponent,
      getComponents: jest.fn(() => []),
    });
  });

  afterEach(() => cleanup());

  it('should render without errors', () => {
    const component = render(
      <Portal name="test-portal">
        <Text testID="portal-content">Test Content</Text>
      </Portal>
    );

    expect(component.toJSON()).toBeNull();
  });

  it('should call addComponent when mounted', () => {
    const portalName = 'test-portal';
    const testContent = <Text testID="portal-content">Test Content</Text>;

    render(<Portal name={portalName}>{testContent}</Portal>);

    expect(mockAddComponent).toHaveBeenCalledTimes(1);
    expect(mockAddComponent).toHaveBeenCalledWith({
      name: portalName,
      component: testContent,
    });
  });

  it('should call removeComponent when unmounted', () => {
    const portalName = 'test-portal';

    const { unmount } = render(
      <Portal name={portalName}>
        <Text testID="portal-content">Test Content</Text>
      </Portal>
    );

    unmount();

    expect(mockRemoveComponent).toHaveBeenCalledTimes(1);
    expect(mockRemoveComponent).toHaveBeenCalledWith(portalName);
  });

  it('should update component when children change', () => {
    const portalName = 'test-portal';
    const initialContent = (
      <Text testID="initial-content">Initial Content</Text>
    );
    const updatedContent = (
      <Text testID="updated-content">Updated Content</Text>
    );

    const { rerender } = render(
      <Portal name={portalName}>{initialContent}</Portal>
    );

    expect(mockAddComponent).toHaveBeenCalledWith({
      name: portalName,
      component: initialContent,
    });

    rerender(<Portal name={portalName}>{updatedContent}</Portal>);

    expect(mockAddComponent).toHaveBeenCalledWith({
      name: portalName,
      component: updatedContent,
    });

    expect(mockAddComponent).toHaveBeenCalledTimes(2);
  });

  it('should update component when name changes', () => {
    const initialName = 'initial-portal';
    const updatedName = 'updated-portal';
    const testContent = <Text testID="portal-content">Test Content</Text>;

    const { rerender } = render(
      <Portal name={initialName}>{testContent}</Portal>
    );

    expect(mockAddComponent).toHaveBeenCalledWith({
      name: initialName,
      component: testContent,
    });

    rerender(<Portal name={updatedName}>{testContent}</Portal>);

    expect(mockRemoveComponent).toHaveBeenCalledWith(initialName);
    expect(mockAddComponent).toHaveBeenCalledWith({
      name: updatedName,
      component: testContent,
    });
  });

  it('should handle multiple portals with different names', () => {
    const portal1Name = 'portal-1';
    const portal2Name = 'portal-2';
    const content1 = <Text testID="content-1">Content 1</Text>;
    const content2 = <Text testID="content-2">Content 2</Text>;

    render(
      <>
        <Portal name={portal1Name}>{content1}</Portal>
        <Portal name={portal2Name}>{content2}</Portal>
      </>
    );

    expect(mockAddComponent).toHaveBeenCalledTimes(2);
    expect(mockAddComponent).toHaveBeenNthCalledWith(1, {
      name: portal1Name,
      component: content1,
    });
    expect(mockAddComponent).toHaveBeenNthCalledWith(2, {
      name: portal2Name,
      component: content2,
    });
  });

  it('should handle null children', () => {
    const portalName = 'null-portal';

    render(<Portal name={portalName}>{null}</Portal>);

    expect(mockAddComponent).toHaveBeenCalledWith({
      name: portalName,
      component: null,
    });
  });

  it('should handle empty string name', () => {
    const emptyName = '';
    const testContent = <Text testID="portal-content">Test Content</Text>;

    render(<Portal name={emptyName}>{testContent}</Portal>);

    expect(mockAddComponent).toHaveBeenCalledWith({
      name: emptyName,
      component: testContent,
    });
  });
});
