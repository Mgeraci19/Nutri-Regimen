import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useApiResource } from '../../hooks/useApiResource';
import { mockIngredients, createMockIngredient } from '../utils/mockData';
import type { Ingredient } from '../../types';
import { apiFetch } from '../../apiClient';

// Mock the API client
vi.mock('../../apiClient', () => ({
  apiFetch: vi.fn()
}));

const mockApiFetch = vi.mocked(apiFetch);

describe('useApiResource Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));
      
      expect(result.current.data).toEqual([]);
      expect(result.current.selectedItem).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchAll', () => {
    it('should fetch all ingredients successfully', async () => {
      mockApiFetch.mockResolvedValue(mockIngredients);

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.data).toEqual(mockIngredients);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockApiFetch).toHaveBeenCalledWith('/ingredients/');
    });

    it('should handle loading state during fetch', async () => {
      let resolvePromise: (value: Ingredient[]) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockApiFetch.mockReturnValue(promise);

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      act(() => {
        result.current.fetchAll();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();

      await act(async () => {
        resolvePromise!(mockIngredients);
        await promise;
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockIngredients);
    });

    it('should handle fetch errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
    });

    it('should clear previous errors on successful fetch', async () => {
      // First fetch fails
      mockApiFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.fetchAll();
      });
      expect(result.current.error).toBe('Network error');

      // Second fetch succeeds
      mockApiFetch.mockResolvedValueOnce(mockIngredients);

      await act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.data).toEqual(mockIngredients);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchById', () => {
    it('should fetch single ingredient successfully', async () => {
      mockApiFetch.mockResolvedValue(mockIngredients[0]);

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.fetchById(1);
      });

      expect(result.current.selectedItem).toEqual(mockIngredients[0]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockApiFetch).toHaveBeenCalledWith('/ingredients/1');
    });

    it('should handle fetchById errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Resource not found'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.fetchById(999);
      });

      expect(result.current.selectedItem).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Resource not found');
    });
  });

  describe('create', () => {
    it('should create ingredient and refresh data', async () => {
      const newIngredient = createMockIngredient({ name: 'New Ingredient' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...ingredientData } = newIngredient;

      // Mock create response
      mockApiFetch.mockResolvedValueOnce(newIngredient);
      // Mock refresh response
      mockApiFetch.mockResolvedValueOnce([...mockIngredients, newIngredient]);

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.create(ingredientData);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toHaveLength(mockIngredients.length + 1);
      expect(mockApiFetch).toHaveBeenCalledWith('/ingredients/', {
        method: 'POST',
        body: JSON.stringify(ingredientData)
      });
    });

    it('should handle create errors', async () => {
      const newIngredient = createMockIngredient({ name: 'Invalid Ingredient' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...ingredientData } = newIngredient;

      mockApiFetch.mockRejectedValue(new Error('Validation failed'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.create(ingredientData);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Validation failed');
    });
  });

  describe('update', () => {
    it('should update ingredient and sync state', async () => {
      const updatedIngredient = { ...mockIngredients[0], name: 'Updated Chicken' };
      
      mockApiFetch
        .mockResolvedValueOnce(mockIngredients) // fetchAll
        .mockResolvedValueOnce(mockIngredients[0]) // fetchById
        .mockResolvedValueOnce(updatedIngredient); // update

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Set initial data by fetching
      await act(async () => {
        await result.current.fetchAll();
      });

      // Select an item
      await act(async () => {
        await result.current.fetchById(1);
      });

      await act(async () => {
        await result.current.update(1, { name: 'Updated Chicken' });
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedItem?.name).toBe('Updated Chicken');
      expect(mockApiFetch).toHaveBeenCalledWith('/ingredients/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Chicken' })
      });
    });

    it('should handle update errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Validation failed'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.update(1, { name: '' });
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Validation failed');
    });
  });

  describe('deleteItem', () => {
    it('should delete ingredient and update state', async () => {
      mockApiFetch
        .mockResolvedValueOnce(mockIngredients) // fetchAll
        .mockResolvedValueOnce(mockIngredients[0]) // fetchById
        .mockResolvedValueOnce({}); // delete

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Set initial data by fetching
      await act(async () => {
        await result.current.fetchAll();
      });

      // Select an item
      await act(async () => {
        await result.current.fetchById(1);
      });

      await act(async () => {
        await result.current.deleteItem(1);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).not.toContain(mockIngredients[0]);
      expect(result.current.selectedItem).toBeNull();
      expect(mockApiFetch).toHaveBeenCalledWith('/ingredients/1', {
        method: 'DELETE'
      });
    });

    it('should handle delete errors', async () => {
      mockApiFetch.mockRejectedValue(new Error('Internal server error'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      await act(async () => {
        await result.current.deleteItem(1);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Internal server error');
    });

    it('should maintain data integrity when deleting non-selected item', async () => {
      mockApiFetch
        .mockResolvedValueOnce(mockIngredients) // fetchAll
        .mockResolvedValueOnce(mockIngredients[0]) // fetchById
        .mockResolvedValueOnce({}); // delete

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Set initial data by fetching
      await act(async () => {
        await result.current.fetchAll();
      });

      // Select first item
      await act(async () => {
        await result.current.fetchById(1);
      });

      await act(async () => {
        await result.current.deleteItem(2); // Delete second item
      });

      expect(result.current.selectedItem).toEqual(mockIngredients[0]); // Should remain selected
      expect(result.current.data.find(item => item.id === 2)).toBeUndefined();
    });
  });

  describe('Error Management', () => {
    it('should clear errors when clearError is called', async () => {
      mockApiFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Generate an error
      await act(async () => {
        await result.current.fetchAll();
      });
      expect(result.current.error).toBe('Network error');

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear selection when clearSelection is called', async () => {
      mockApiFetch.mockResolvedValue(mockIngredients[0]);

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Set a selected item by fetching
      await act(async () => {
        await result.current.fetchById(1);
      });

      expect(result.current.selectedItem).toEqual(mockIngredients[0]);

      // Clear the selection
      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedItem).toBeNull();
    });
  });

  describe('Business Logic Validation', () => {
    it('should handle concurrent operations correctly', async () => {
      // Mock both API calls
      mockApiFetch
        .mockResolvedValueOnce(mockIngredients) // fetchAll
        .mockResolvedValueOnce(mockIngredients[0]); // fetchById

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Start both operations concurrently
      await act(async () => {
        await Promise.all([
          result.current.fetchAll(),
          result.current.fetchById(1)
        ]);
      });

      // Both operations should complete successfully
      expect(result.current.data).toEqual(mockIngredients);
      expect(result.current.selectedItem).toEqual(mockIngredients[0]);
      expect(result.current.error).toBeNull();
    });

    it('should maintain data consistency during CRUD operations', async () => {
      const newIngredient = createMockIngredient({ id: 4, name: 'Test Ingredient' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...createData } = newIngredient;

      const { result } = renderHook(() => useApiResource<Ingredient>('/ingredients/'));

      // Initial fetch
      mockApiFetch.mockResolvedValueOnce(mockIngredients);
      await act(async () => {
        await result.current.fetchAll();
      });
      const initialCount = result.current.data.length;

      // Create new item
      mockApiFetch
        .mockResolvedValueOnce(newIngredient) // create response
        .mockResolvedValueOnce([...mockIngredients, newIngredient]); // refresh response

      await act(async () => {
        await result.current.create(createData);
      });
      expect(result.current.data.length).toBe(initialCount + 1);

      // Delete the item
      mockApiFetch.mockResolvedValueOnce({});
      await act(async () => {
        await result.current.deleteItem(4);
      });
      expect(result.current.data.length).toBe(initialCount);
      expect(result.current.data.find(item => item.id === 4)).toBeUndefined();
    });
  });
});
