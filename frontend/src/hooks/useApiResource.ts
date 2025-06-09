import { useState, useCallback } from 'react';
import { apiFetch } from '../apiClient';

interface UseApiResourceReturn<T> {
  data: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: number, item: Partial<T>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  clearError: () => void;
  clearSelection: () => void;
}

export function useApiResource<T extends { id: number }>(
  endpoint: string
): UseApiResourceReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Fetching all items from ${endpoint}`);
      const result = await apiFetch<T[]>(endpoint);
      console.log(`✅ Successfully fetched ${result.length} items`);
      setData(result);
    } catch (err) {
      console.error(`❌ Error fetching from ${endpoint}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const fetchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Fetching item ${id} from ${endpoint}`);
      const result = await apiFetch<T>(`${endpoint}${id}`);
      console.log(`✅ Successfully fetched item:`, result);
      setSelectedItem(result);
    } catch (err) {
      console.error(`❌ Error fetching item ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Creating new item at ${endpoint}:`, item);
      const result = await apiFetch<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(item),
      });
      console.log(`✅ Successfully created item:`, result);
      
      // Refresh the data list
      await fetchAll();
    } catch (err) {
      console.error(`❌ Error creating item:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, fetchAll]);

  const update = useCallback(async (id: number, item: Partial<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Updating item ${id} at ${endpoint}:`, item);
      const result = await apiFetch<T>(`${endpoint}${id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
      });
      console.log(`✅ Successfully updated item:`, result);
      
      // Update the data list and selected item
      setData(prev => prev.map(existing => existing.id === id ? result : existing));
      if (selectedItem?.id === id) {
        setSelectedItem(result);
      }
    } catch (err) {
      console.error(`❌ Error updating item ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, selectedItem]);

  const deleteItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Deleting item ${id} from ${endpoint}`);
      await apiFetch(`${endpoint}${id}`, {
        method: 'DELETE',
      });
      console.log(`✅ Successfully deleted item ${id}`);
      
      // Remove from data list and clear selection if it was selected
      setData(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(`❌ Error deleting item ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, selectedItem]);

  return {
    data,
    selectedItem,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    deleteItem,
    clearError,
    clearSelection,
  };
}
