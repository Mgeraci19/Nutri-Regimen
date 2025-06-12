import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormState } from '../../hooks/useFormState';

interface TestFormData extends Record<string, unknown> {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

const initialFormData: TestFormData = {
  name: '',
  email: '',
  age: 0,
  isActive: false
};

describe('useFormState Hook', () => {
  describe('Initial State', () => {
    it('should initialize with provided initial data', () => {
      const { result } = renderHook(() => useFormState(initialFormData));
      
      expect(result.current.formData).toEqual(initialFormData);
    });

    it('should initialize with complex initial data', () => {
      const complexData: TestFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      };

      const { result } = renderHook(() => useFormState(complexData));
      
      expect(result.current.formData).toEqual(complexData);
    });
  });

  describe('updateField', () => {
    it('should update string fields correctly', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        result.current.updateField('name', 'John Doe');
      });

      expect(result.current.formData.name).toBe('John Doe');
      expect(result.current.formData.email).toBe(''); // Other fields unchanged
    });

    it('should update number fields correctly', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        result.current.updateField('age', 25);
      });

      expect(result.current.formData.age).toBe(25);
    });

    it('should update boolean fields correctly', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        result.current.updateField('isActive', true);
      });

      expect(result.current.formData.isActive).toBe(true);
    });

    it('should handle multiple field updates', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        result.current.updateField('name', 'Jane Smith');
        result.current.updateField('email', 'jane@example.com');
        result.current.updateField('age', 28);
      });

      expect(result.current.formData).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 28,
        isActive: false
      });
    });

    it('should preserve object immutability', () => {
      const { result } = renderHook(() => useFormState(initialFormData));
      
      const originalFormData = result.current.formData;

      act(() => {
        result.current.updateField('name', 'New Name');
      });

      // Original object should not be mutated
      expect(originalFormData.name).toBe('');
      expect(result.current.formData.name).toBe('New Name');
      expect(result.current.formData).not.toBe(originalFormData);
    });
  });

  describe('resetForm', () => {
    it('should reset form to initial values', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      // Make some changes
      act(() => {
        result.current.updateField('name', 'John Doe');
        result.current.updateField('email', 'john@example.com');
        result.current.updateField('age', 30);
      });

      expect(result.current.formData.name).toBe('John Doe');

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual(initialFormData);
    });

    it('should reset to custom initial values', () => {
      const customInitial: TestFormData = {
        name: 'Default Name',
        email: 'default@example.com',
        age: 18,
        isActive: true
      };

      const { result } = renderHook(() => useFormState(customInitial));

      // Make changes
      act(() => {
        result.current.updateField('name', 'Changed Name');
        result.current.updateField('age', 25);
      });

      // Reset should go back to custom initial values
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData).toEqual(customInitial);
    });
  });

  describe('Business Logic - Ingredient Form Validation', () => {
    interface IngredientFormData extends Record<string, unknown> {
      name: string;
      category: string;
      calories_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
    }

    const ingredientInitial: IngredientFormData = {
      name: '',
      category: '',
      calories_per_100g: 0,
      protein_per_100g: 0,
      carbs_per_100g: 0,
      fat_per_100g: 0
    };

    it('should handle ingredient nutritional data updates', () => {
      const { result } = renderHook(() => useFormState(ingredientInitial));

      act(() => {
        result.current.updateField('name', 'Chicken Breast');
        result.current.updateField('category', 'Protein');
        result.current.updateField('calories_per_100g', 165);
        result.current.updateField('protein_per_100g', 31);
        result.current.updateField('carbs_per_100g', 0);
        result.current.updateField('fat_per_100g', 3.6);
      });

      expect(result.current.formData).toEqual({
        name: 'Chicken Breast',
        category: 'Protein',
        calories_per_100g: 165,
        protein_per_100g: 31,
        carbs_per_100g: 0,
        fat_per_100g: 3.6
      });
    });

    it('should validate nutritional data constraints', () => {
      const { result } = renderHook(() => useFormState(ingredientInitial));

      // Test that we can set valid nutritional values
      act(() => {
        result.current.updateField('calories_per_100g', 100);
        result.current.updateField('protein_per_100g', 20);
      });

      expect(result.current.formData.calories_per_100g).toBe(100);
      expect(result.current.formData.protein_per_100g).toBe(20);

      // Business logic should prevent negative values (this would be handled in the component)
      const formData = result.current.formData;
      expect(formData.calories_per_100g as number).toBeGreaterThanOrEqual(0);
      expect(formData.protein_per_100g as number).toBeGreaterThanOrEqual(0);
      expect(formData.carbs_per_100g as number).toBeGreaterThanOrEqual(0);
      expect(formData.fat_per_100g as number).toBeGreaterThanOrEqual(0);
    });

    it('should handle decimal nutritional values', () => {
      const { result } = renderHook(() => useFormState(ingredientInitial));

      act(() => {
        result.current.updateField('protein_per_100g', 25.5);
        result.current.updateField('fat_per_100g', 3.2);
      });

      expect(result.current.formData.protein_per_100g).toBe(25.5);
      expect(result.current.formData.fat_per_100g).toBe(3.2);
    });
  });

  describe('Business Logic - Recipe Form Validation', () => {
    interface RecipeFormData extends Record<string, unknown> {
      name: string;
      description: string;
      instructions: string;
      selectedIngredients: Array<{
        ingredient_id: number;
        quantity: number;
        unit: string;
      }>;
    }

    const recipeInitial: RecipeFormData = {
      name: '',
      description: '',
      instructions: '',
      selectedIngredients: []
    };

    it('should handle recipe basic information updates', () => {
      const { result } = renderHook(() => useFormState(recipeInitial));

      act(() => {
        result.current.updateField('name', 'Chicken Salad');
        result.current.updateField('description', 'A healthy chicken salad');
        result.current.updateField('instructions', '1. Cook chicken\n2. Mix with vegetables');
      });

      expect(result.current.formData.name).toBe('Chicken Salad');
      expect(result.current.formData.description).toBe('A healthy chicken salad');
      expect(result.current.formData.instructions).toBe('1. Cook chicken\n2. Mix with vegetables');
    });

    it('should handle complex ingredient associations', () => {
      const { result } = renderHook(() => useFormState(recipeInitial));

      const ingredients = [
        { ingredient_id: 1, quantity: 150, unit: 'g' },
        { ingredient_id: 2, quantity: 100, unit: 'g' }
      ];

      act(() => {
        result.current.updateField('selectedIngredients', ingredients);
      });

      expect(result.current.formData.selectedIngredients).toEqual(ingredients);
      expect((result.current.formData.selectedIngredients as unknown[]).length).toBe(2);
    });

    it('should validate recipe completeness', () => {
      const { result } = renderHook(() => useFormState(recipeInitial));

      act(() => {
        result.current.updateField('name', 'Complete Recipe');
        result.current.updateField('description', 'A complete recipe');
        result.current.updateField('instructions', 'Step by step instructions');
        result.current.updateField('selectedIngredients', [
          { ingredient_id: 1, quantity: 100, unit: 'g' }
        ]);
      });

      const formData = result.current.formData;
      
      // Validate that all required fields are present
      expect((formData.name as string).trim()).toBeTruthy();
      expect((formData.description as string).trim()).toBeTruthy();
      expect((formData.instructions as string).trim()).toBeTruthy();
      expect((formData.selectedIngredients as unknown[]).length).toBeGreaterThan(0);
      
      // Validate ingredient data structure
      const ingredients = formData.selectedIngredients as Array<{
        ingredient_id: number;
        quantity: number;
        unit: string;
      }>;
      
      ingredients.forEach(ingredient => {
        expect(ingredient.ingredient_id).toBeGreaterThan(0);
        expect(ingredient.quantity).toBeGreaterThan(0);
        expect(ingredient.unit.trim()).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined field updates gracefully', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        // TypeScript would prevent this, but testing runtime behavior
        result.current.updateField('name', undefined as unknown as string);
      });

      expect(result.current.formData.name).toBeUndefined();
    });

    it('should handle null field updates gracefully', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        // TypeScript would prevent this, but testing runtime behavior
        result.current.updateField('name', null as unknown as string);
      });

      expect(result.current.formData.name).toBeNull();
    });

    it('should handle rapid successive updates', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      act(() => {
        result.current.updateField('name', 'First');
        result.current.updateField('name', 'Second');
        result.current.updateField('name', 'Third');
        result.current.updateField('name', 'Final');
      });

      expect(result.current.formData.name).toBe('Final');
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders for same values', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      const initialFormDataRef = result.current.formData;

      act(() => {
        result.current.updateField('name', '');
      });

      // Setting the same value should not create a new object reference
      expect(result.current.formData).toBe(initialFormDataRef);
    });

    it('should create new object reference only when values change', () => {
      const { result } = renderHook(() => useFormState(initialFormData));

      const initialFormDataRef = result.current.formData;

      act(() => {
        result.current.updateField('name', 'New Value');
      });

      // Setting a different value should create a new object reference
      expect(result.current.formData).not.toBe(initialFormDataRef);
    });
  });
});
