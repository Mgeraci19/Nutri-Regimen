import React from 'react';
import type { Ingredient } from '../../types';

interface SelectedIngredientViewProps {
  ingredient: Ingredient | null;
  onClear: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const SelectedIngredientView: React.FC<SelectedIngredientViewProps> = ({
  ingredient,
  onClear,
  onEdit,
  onDelete
}) => {
  if (!ingredient) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Selected Ingredient</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No ingredient selected</p>
            <p className="text-sm text-gray-400 mt-2">
              Click "View" on any ingredient to see details here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">
            Selected Ingredient
            <span className="badge badge-secondary">{ingredient.name}</span>
          </h2>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={onClear}
            aria-label="Clear selection"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{ingredient.name}</span>
                </div>
                {ingredient.category && (
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 badge badge-outline">{ingredient.category}</span>
                  </div>
                )}
                {ingredient.id && (
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 text-sm">{ingredient.id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Macronutrients */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Macronutrients (per 100g)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-medium">{ingredient.calories_per_100g || 0} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-medium">{ingredient.protein_per_100g || 0}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbohydrates:</span>
                  <span className="font-medium">{ingredient.carbs_per_100g || 0}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fat:</span>
                  <span className="font-medium">{ingredient.fat_per_100g || 0}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Nutrients */}
          {(ingredient.fiber_per_100g || ingredient.sugar_per_100g || ingredient.sodium_per_100g) && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Additional Nutrients (per 100g)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ingredient.fiber_per_100g && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fiber:</span>
                    <span className="font-medium">{ingredient.fiber_per_100g}g</span>
                  </div>
                )}
                {ingredient.sugar_per_100g && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sugar:</span>
                    <span className="font-medium">{ingredient.sugar_per_100g}g</span>
                  </div>
                )}
                {ingredient.sodium_per_100g && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sodium:</span>
                    <span className="font-medium">{ingredient.sodium_per_100g}mg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(ingredient.created_at || ingredient.updated_at) && (
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm mb-2 text-gray-600">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                {ingredient.created_at && (
                  <div>
                    <span>Created:</span>
                    <span className="ml-1">{new Date(ingredient.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {ingredient.updated_at && (
                  <div>
                    <span>Updated:</span>
                    <span className="ml-1">{new Date(ingredient.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end pt-4">
            {onEdit && (
              <button 
                className="btn btn-outline"
                onClick={() => onEdit(ingredient.id)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-outline btn-error"
                onClick={() => onDelete(ingredient.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
