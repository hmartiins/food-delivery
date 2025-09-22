import { act, renderHook } from '@testing-library/react-native';

import { useCartStore } from '../cart.store';
import {
  itemWithCustomizations,
  mockCustomization1,
  mockCustomization2,
  mockCustomization3,
  mockItem1,
  mockItem2,
} from './mocks/cart.mock';

describe('useCartStore', () => {
  beforeEach(() => {
    act(() => useCartStore.getState().clearCart());
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const {
        result: { current: state },
      } = renderHook(() => useCartStore());

      expect(state.items).toEqual([]);
      expect(state.getTotalItems()).toBe(0);
      expect(state.getTotalPrice()).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should add a new item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.addItem(mockItem1));

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        ...mockItem1,
        quantity: 1,
        customizations: [],
      });
    });

    it('should add a new item with customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.addItem(itemWithCustomizations));

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        ...itemWithCustomizations,
        quantity: 1,
      });
    });

    it('should increment quantity when adding existing item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem1);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should increment quantity when adding existing item with same customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.addItem(itemWithCustomizations);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should add as new item when customizations are different', () => {
      const { result } = renderHook(() => useCartStore());
      const item1WithCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item1WithDifferentCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1WithCustomizations);
        result.current.addItem(item1WithDifferentCustomizations);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.items[1].quantity).toBe(1);
    });

    it('should handle undefined customizations as empty array', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithUndefinedCustomizations = {
        ...mockItem1,
        customizations: undefined,
      };

      act(() => result.current.addItem(itemWithUndefinedCustomizations));

      expect(result.current.items[0].customizations).toEqual([]);
    });

    it('should add multiple different items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].id).toBe(mockItem1.id);
      expect(result.current.items[1].id).toBe(mockItem2.id);
    });
  });

  describe('removeItem', () => {
    it('should remove item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.removeItem(mockItem1.id, []);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should remove item with matching customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.removeItem(mockItem1.id, [
          mockCustomization1,
          mockCustomization2,
        ]);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not remove item with different customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.removeItem(mockItem1.id, [mockCustomization2]);
      });

      expect(result.current.items).toHaveLength(1);
    });

    it('should handle customizations order (should remove regardless of order)', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.removeItem(mockItem1.id, [
          mockCustomization2,
          mockCustomization1,
        ]);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should only remove specific item when multiple similar items exist', () => {
      const { result } = renderHook(() => useCartStore());
      const item1WithCustomization1 = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item1WithCustomization2 = {
        ...mockItem1,
        customizations: [mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1WithCustomization1);
        result.current.addItem(item1WithCustomization2);
        result.current.removeItem(mockItem1.id, [mockCustomization1]);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].customizations).toEqual([
        mockCustomization2,
      ]);
    });
  });

  describe('increaseQty', () => {
    it('should increase quantity for item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.increaseQty(mockItem1.id, []);
      });

      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should increase quantity for item with matching customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.increaseQty(mockItem1.id, [
          mockCustomization1,
          mockCustomization2,
        ]);
      });

      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should not increase quantity for item with different customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.increaseQty(mockItem1.id, [mockCustomization2]);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should only increase quantity for correct item when multiple exist', () => {
      const { result } = renderHook(() => useCartStore());
      const item1WithCustomization1 = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item1WithCustomization2 = {
        ...mockItem1,
        customizations: [mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1WithCustomization1);
        result.current.addItem(item1WithCustomization2);
        result.current.increaseQty('item1', [mockCustomization1]);
      });

      expect(result.current.items[0].quantity).toBe(2);
      expect(result.current.items[1].quantity).toBe(1);
    });
  });

  describe('decreaseQty', () => {
    it('should decrease quantity for item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem1); // quantity = 2
        result.current.decreaseQty(mockItem1.id, []);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should remove item when quantity becomes 0', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.decreaseQty(mockItem1.id, []);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should decrease quantity for item with matching customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.addItem(itemWithCustomizations); // quantity = 2
        result.current.decreaseQty(mockItem1.id, [
          mockCustomization1,
          mockCustomization2,
        ]);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should remove item with customizations when quantity becomes 0', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.decreaseQty(mockItem1.id, [mockCustomization1]);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not decrease quantity for item with different customizations', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.addItem(itemWithCustomizations); // quantity = 2
        result.current.decreaseQty(mockItem1.id, [mockCustomization2]);
      });

      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should only decrease quantity for correct item when multiple exist', () => {
      const { result } = renderHook(() => useCartStore());
      const item1WithCustomization1 = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item1WithCustomization2 = {
        ...mockItem1,
        customizations: [mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1WithCustomization1);
        result.current.addItem(item1WithCustomization1); // quantity = 2
        result.current.addItem(item1WithCustomization2);
        result.current.decreaseQty(mockItem1.id, [mockCustomization1]);
      });

      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.items[1].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should clear cart even with items with customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.addItem(mockItem2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.getTotalItems()).toBe(0);
    });

    it('should return correct total for single item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem1); // quantity = 2
      });

      expect(result.current.getTotalItems()).toBe(2);
    });

    it('should return correct total for multiple different items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem1); // quantity = 2
        result.current.addItem(mockItem2); // quantity = 1
      });

      expect(result.current.getTotalItems()).toBe(3);
    });

    it('should return correct total for items with customizations', () => {
      const { result } = renderHook(() => useCartStore());
      const item1WithCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item2WithCustomizations = {
        ...mockItem1,
        customizations: [mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1WithCustomizations);
        result.current.addItem(item1WithCustomizations); // quantity = 2
        result.current.addItem(item2WithCustomizations); // quantity = 1
      });

      expect(result.current.getTotalItems()).toBe(3);
    });
  });

  describe('getTotalPrice', () => {
    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('should calculate correct price for single item without customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.addItem(mockItem1));

      expect(result.current.getTotalPrice()).toBe(10.99);
    });

    it('should calculate correct price for multiple quantity of same item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1);
        result.current.addItem(mockItem1); // 10.99 * 2
      });

      expect(result.current.getTotalPrice()).toBe(21.98);
    });

    it('should calculate correct price for multiple different items', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1); // 10.99 * 1
        result.current.addItem(mockItem2); // 15.50 * 1
      });

      expect(result.current.getTotalPrice()).toBeCloseTo(26.49);
    });

    it('should calculate correct price with customizations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => result.current.addItem(itemWithCustomizations));

      expect(result.current.getTotalPrice()).toBeCloseTo(16.49);
    });

    it('should calculate correct price with customizations and multiple quantities', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(itemWithCustomizations);
        result.current.addItem(itemWithCustomizations); // quantity = 2
      });

      expect(result.current.getTotalPrice()).toBeCloseTo(32.98);
    });

    it('should calculate correct price with mixed items (with and without customizations)', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithCustomizations = {
        ...mockItem1, // 10.99
        customizations: [mockCustomization1], // 2.00
      }; // Total per item: 12.99

      act(() => {
        result.current.addItem(itemWithCustomizations); // 12.99 * 1
        result.current.addItem(mockItem2); // 15.50 * 1
      });

      expect(result.current.getTotalPrice()).toBeCloseTo(28.49);
    });

    it('should handle customizations with zero price', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithZeroPriceCustomization = {
        ...mockItem1, // 10.99
        customizations: [mockCustomization3], // 0
      }; // Total per item: 10.99

      act(() => {
        result.current.addItem(itemWithZeroPriceCustomization);
      });

      expect(result.current.getTotalPrice()).toBe(10.99);
    });

    it('should handle items without customizations property', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addItem(mockItem1); // Should handle undefined customizations
      });

      expect(result.current.getTotalPrice()).toBe(10.99);
    });
  });

  describe('customizations comparison edge cases', () => {
    it('should treat empty customizations and undefined as equal', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithEmptyCustomizations = {
        ...mockItem1,
        customizations: [],
      };
      const itemWithUndefinedCustomizations = {
        ...mockItem1,
        customizations: undefined,
      };

      act(() => {
        result.current.addItem(itemWithEmptyCustomizations);
        result.current.addItem(itemWithUndefinedCustomizations);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should handle customizations with same items in different order', () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = {
        ...mockItem1,
        customizations: [mockCustomization1, mockCustomization2],
      };
      const item2 = {
        ...mockItem1,
        customizations: [mockCustomization2, mockCustomization1],
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should differentiate between different sets of customizations', () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = {
        ...mockItem1,
        customizations: [mockCustomization1],
      };
      const item2 = {
        ...mockItem1,
        customizations: [mockCustomization1, mockCustomization2],
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.items[1].quantity).toBe(1);
    });
  });
});
