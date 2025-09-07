import { act, renderHook } from '@testing-library/react-native';

import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';

import { useAuthStore } from '../auth.store';

jest.mock('@/lib/appwrite', () => ({ getCurrentUser: jest.fn() }));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
  typeof getCurrentUser
>;

const mockUser: User = {
  $id: '123',
  $createdAt: '2023-01-01T00:00:00.000Z',
  $updatedAt: '2023-01-01T00:00:00.000Z',
  $permissions: [],
  $databaseId: 'db123',
  $collectionId: 'users123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().setIsAuthenticated(false);
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setIsLoading(false);
    });

    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const {
        result: { current: state },
      } = renderHook(() => useAuthStore());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('set states', () => {
    it('should update isAuthenticated state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setIsAuthenticated(true);
      });
      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.setIsAuthenticated(false);
      });
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should update user state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(mockUser);
      });
      expect(result.current.user).toEqual(mockUser);

      act(() => {
        result.current.setUser(null);
      });
      expect(result.current.user).toBeNull();
    });

    it('should update isLoading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setIsLoading(true);
      });
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setIsLoading(false);
      });
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fetchAuthenticatedUser', () => {
    it('should set loading to true at start and false at end', async () => {
      let resolvePromise: (value: User) => void;
      const delayedPromise = new Promise<User>(resolve => {
        resolvePromise = resolve;
      });

      mockGetCurrentUser.mockReturnValue(delayedPromise);
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.fetchAuthenticatedUser();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise(mockUser);
        await delayedPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should authenticate user when getCurrentUser returns a user', async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser);
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchAuthenticatedUser();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });

    it('should not authenticate when getCurrentUser returns null', async () => {
      mockGetCurrentUser.mockResolvedValue(null as any);
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchAuthenticatedUser();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should not authenticate when getCurrentUser returns undefined', async () => {
      mockGetCurrentUser.mockResolvedValue(undefined as any);
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.fetchAuthenticatedUser();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors and reset authentication state', async () => {
      const error = new Error('Network error');
      mockGetCurrentUser.mockRejectedValue(error);
      const { result } = renderHook(() => useAuthStore());

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await act(async () => {
        await result.current.fetchAuthenticatedUser();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching authenticated user',
        error
      );

      consoleSpy.mockRestore();
    });
  });
});
