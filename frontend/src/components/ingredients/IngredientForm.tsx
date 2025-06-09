import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import type { Ingredient } from '../../types';

interface IngredientFormData {
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  [key: string]: string | number | undefined;
}

interface IngredientFormProps {
  onSubmit: (data: Omit<Ingredient, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<IngredientFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

const defaultFormData: IngredientFormData = {
  name: '',
  category: '',
  calories_per_100g: 0,
  protein_per_100g: 0,
  carbs_per_100g: 0,
  fat_per_100g: 0,
  fiber_per_100g: 0,
  sugar_per_100g: 0,
  sodium_per_100g: 0,
};

export const IngredientForm: React.FC<IngredientFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
  submitLabel = 'Create Ingredient'
}) => {
  const { formData, updateField, resetForm } = useFormState<IngredientFormData>({
    ...defaultFormData,
    ...initialData
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{submitLabel}</h2>
        
        <form onSubmit={handleSubmit} role="form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="form-control">
              <label className="label" htmlFor="ingredient-name">
                <span className="label-text">Name *</span>
              </label>
              <input 
                id="ingredient-name"
                type="text" 
                placeholder="Ingredient name" 
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label" htmlFor="ingredient-category">
                <span className="label-text">Category</span>
              </label>
              <input 
                id="ingredient-category"
                type="text" 
                placeholder="e.g., Protein, Vegetable, Grain" 
                className="input input-bordered"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
              />
            </div>
            
            {/* Macronutrients */}
            <div className="form-control">
              <label className="label" htmlFor="ingredient-calories">
                <span className="label-text">Calories (per 100g)</span>
              </label>
              <input 
                id="ingredient-calories"
                type="number" 
                placeholder="0" 
                className="input input-bordered"
                value={formData.calories_per_100g}
                onChange={(e) => updateField('calories_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="form-control">
              <label className="label" htmlFor="ingredient-protein">
                <span className="label-text">Protein (g per 100g)</span>
              </label>
              <input 
                id="ingredient-protein"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.protein_per_100g}
                onChange={(e) => updateField('protein_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="form-control">
              <label className="label" htmlFor="ingredient-carbs">
                <span className="label-text">Carbs (g per 100g)</span>
              </label>
              <input 
                id="ingredient-carbs"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.carbs_per_100g}
                onChange={(e) => updateField('carbs_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="form-control">
              <label className="label" htmlFor="ingredient-fat">
                <span className="label-text">Fat (g per 100g)</span>
              </label>
              <input 
                id="ingredient-fat"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.fat_per_100g}
                onChange={(e) => updateField('fat_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            {/* Additional nutrients */}
            <div className="form-control">
              <label className="label" htmlFor="ingredient-fiber">
                <span className="label-text">Fiber (g per 100g)</span>
              </label>
              <input 
                id="ingredient-fiber"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.fiber_per_100g}
                onChange={(e) => updateField('fiber_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="ingredient-sugar">
                <span className="label-text">Sugar (g per 100g)</span>
              </label>
              <input 
                id="ingredient-sugar"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.sugar_per_100g}
                onChange={(e) => updateField('sugar_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label" htmlFor="ingredient-sodium">
                <span className="label-text">Sodium (mg per 100g)</span>
              </label>
              <input 
                id="ingredient-sodium"
                type="number" 
                step="0.1"
                placeholder="0" 
                className="input input-bordered"
                value={formData.sodium_per_100g}
                onChange={(e) => updateField('sodium_per_100g', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-success"
              disabled={isLoading || !isValid}
            >
              {isLoading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
