import { createElement } from 'react';

import { Text, View } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { usePortalStore } from '../portal.store';

describe('usePortalStore', () => {
  beforeEach(() => {
    act(() => {
      const state = usePortalStore.getState();
      state.components = {};
    });
  });

  describe('initial state', () => {
    it('should have the correct initial state', () => {
      const {
        result: { current: state },
      } = renderHook(() => usePortalStore());

      expect(state.components).toEqual({});
      expect(state.getComponents()).toEqual([]);
    });
  });

  describe('addComponent', () => {
    it('should add a component to the store', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent = createElement(Text, null, '');

      act(() => {
        result.current.addComponent({
          name: 'test-component',
          component: mockComponent,
        });
      });

      expect(result.current.components['test-component']).toBe(mockComponent);
      expect(Object.keys(result.current.components)).toHaveLength(1);
    });

    it('should add multiple components to the store', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent1 = createElement(Text, null, 'Component 1');
      const mockComponent2 = createElement(View, null);

      act(() => {
        result.current.addComponent({
          name: 'component-1',
          component: mockComponent1,
        });
      });

      act(() => {
        result.current.addComponent({
          name: 'component-2',
          component: mockComponent2,
        });
      });

      expect(result.current.components['component-1']).toBe(mockComponent1);
      expect(result.current.components['component-2']).toBe(mockComponent2);
      expect(Object.keys(result.current.components)).toHaveLength(2);
    });

    it('should overwrite an existing component with the same name', () => {
      const { result } = renderHook(() => usePortalStore());
      const oldComponent = createElement(Text, null, 'Old Component');
      const newComponent = createElement(Text, null, 'New Component');

      act(() => {
        result.current.addComponent({
          name: 'same-name',
          component: oldComponent,
        });
      });

      act(() => {
        result.current.addComponent({
          name: 'same-name',
          component: newComponent,
        });
      });

      expect(result.current.components['same-name']).toBe(newComponent);
      expect(Object.keys(result.current.components)).toHaveLength(1);
    });
  });

  describe('removeComponent', () => {
    it('should remove a specific component from the store', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent = createElement(Text, null, 'Test Component');

      act(() => {
        result.current.addComponent({
          name: 'test-component',
          component: mockComponent,
        });
      });

      expect(result.current.components['test-component']).toBe(mockComponent);

      act(() => {
        result.current.removeComponent('test-component');
      });

      expect(result.current.components['test-component']).toBeUndefined();
      expect(Object.keys(result.current.components)).toHaveLength(0);
    });

    it('should keep other components when removing a specific one', () => {
      const { result } = renderHook(() => usePortalStore());
      const component1 = createElement(Text, null, 'Component 1');
      const component2 = createElement(Text, null, 'Component 2');
      const component3 = createElement(Text, null, 'Component 3');

      act(() => {
        result.current.addComponent({
          name: 'component-1',
          component: component1,
        });
        result.current.addComponent({
          name: 'component-2',
          component: component2,
        });
        result.current.addComponent({
          name: 'component-3',
          component: component3,
        });
      });

      act(() => {
        result.current.removeComponent('component-2');
      });

      expect(result.current.components['component-1']).toBe(component1);
      expect(result.current.components['component-2']).toBeUndefined();
      expect(result.current.components['component-3']).toBe(component3);
      expect(Object.keys(result.current.components)).toHaveLength(2);
    });

    it('should not affect the store when trying to remove a component that does not exist', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent = createElement(Text, null, 'Test Component');

      act(() => {
        result.current.addComponent({
          name: 'existing-component',
          component: mockComponent,
        });
      });

      act(() => {
        result.current.removeComponent('non-existent-component');
      });

      expect(result.current.components['existing-component']).toBe(
        mockComponent
      );
      expect(Object.keys(result.current.components)).toHaveLength(1);
    });
  });

  describe('getComponents', () => {
    it('should return an empty array when there are no components', () => {
      const { result } = renderHook(() => usePortalStore());

      const components = result.current.getComponents();

      expect(components).toEqual([]);
      expect(Array.isArray(components)).toBe(true);
    });

    it('should return an array of entries [name, component]', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent1 = createElement(Text, null, 'Component 1');
      const mockComponent2 = createElement(View, null);

      act(() => {
        result.current.addComponent({
          name: 'test-1',
          component: mockComponent1,
        });
        result.current.addComponent({
          name: 'test-2',
          component: mockComponent2,
        });
      });

      const components = result.current.getComponents();

      expect(components).toHaveLength(2);
      expect(components).toContainEqual(['test-1', mockComponent1]);
      expect(components).toContainEqual(['test-2', mockComponent2]);
    });

    it('should reflect changes in real time when components are added/removed', () => {
      const { result } = renderHook(() => usePortalStore());
      const mockComponent = createElement(Text, null, 'Dynamic Component');

      expect(result.current.getComponents()).toHaveLength(0);

      act(() => {
        result.current.addComponent({
          name: 'dynamic',
          component: mockComponent,
        });
      });

      expect(result.current.getComponents()).toHaveLength(1);
      expect(result.current.getComponents()).toContainEqual([
        'dynamic',
        mockComponent,
      ]);

      act(() => {
        result.current.removeComponent('dynamic');
      });

      expect(result.current.getComponents()).toHaveLength(0);
    });
  });
});
