import React from 'react';
import { useFormState } from '../../hooks/useFormState';
import type { Recipe, Ingredient } from '../../types';

interface RecipeIngredientData {
  ingredient_id: number;
  quantity: number;
  unit: string;
}

interface RecipeFormData {
  name: string;
  description: string;
  instructions: string;
  ingredients: RecipeIngredientData[];
  [key: string]: string | RecipeIngredientData[] | undefined;
}

interface RecipeFormProps {
  onSubmit: (data: Omit<Recipe, 'id' | 'user_id' | 'ingredient_associations'> & { ingredients: RecipeIngredientData[] }) => Promise<void>;
  onCancel: () => void;
  availableIngredients: Ingredient[];
  initialData?: Partial<RecipeFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

const defaultFormData: RecipeFormData = {
  name: '',
  description: '',
  instructions: '',
  ingredients: [],
};

const unitOptions = [
  { value: 'g', label: 'grams (g)' },
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 'ml', label: 'milliliters (ml)' },
  { value: 'l', label: 'liters (l)' },
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tablespoon' },
  { value: 'tsp', label: 'teaspoon' },
  { value: 'whole', label: 'whole' },
  { value: 'slices', label: 'slices' },
];

export const RecipeForm: React.FC<RecipeFormProps> = ({
  onSubmit,
  onCancel,
  availableIngredients,
  initialData = {},
  isLoading = false,
  submitLabel = 'Create Recipe'
}) => {
  const { formData, updateField, resetForm } = useFormState<RecipeFormData>({
    ...defaultFormData,
    ...initialData
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.ingredients.length === 0) {
      return;
    }

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addIngredient = () => {
    updateField('ingredients', [
      ...formData.ingredients,
      { ingredient_id: 0, quantity: 0, unit: 'g' }
    ]);
  };

  const removeIngredient = (index: number) => {
    updateField('ingredients', formData.ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredientData, value: string | number) => {
    const updatedIngredients = formData.ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    updateField('ingredients', updatedIngredients);
  };

  const isValid = formData.name.trim().length > 0 && formData.ingredients.length > 0;

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{submitLabel}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {/* Basic Recipe Info */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Recipe Name *</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter recipe name" 
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                placeholder="Enter recipe description" 
                className="textarea textarea-bordered"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Instructions</span>
              </label>
              <textarea 
                placeholder="Enter cooking instructions" 
                className="textarea textarea-bordered"
                rows={4}
                value={formData.instructions}
                onChange={(e) => updateField('instructions', e.target.value)}
              />
            </div>

            {/* Ingredients Section */}
            <div className="divider">Ingredients *</div>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-4 bg-base-300 rounded-lg">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ingredient</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={ingredient.ingredient_id}
                    onChange={(e) => updateIngredient(index, 'ingredient_id', parseInt(e.target.value))}
                  >
                    <option value={0}>Select ingredient</option>
                    {availableIngredients.map(ing => (
                      <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quantity</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0" 
                    className="input input-bordered"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  >
                    {unitOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="button"
                  className="btn btn-error btn-sm"
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <button 
                type="button"
                className="btn btn-outline"
                onClick={addIngredient}
              >
                Add Ingredient
              </button>
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
