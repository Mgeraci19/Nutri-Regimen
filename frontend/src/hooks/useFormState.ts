import { useState, useCallback } from 'react';

interface UseFormStateReturn<T> {
  formData: T;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  resetForm: (initialData?: T) => void;
  setFormData: (data: T) => void;
}

export function useFormState<T extends Record<string, unknown>>(
  initialData: T
): UseFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const resetForm = useCallback((newInitialData?: T) => {
    setFormData(newInitialData || initialData);
  }, [initialData]);

  return {
    formData,
    updateField,
    resetForm,
    setFormData,
  };
}
