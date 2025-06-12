import React from 'react';
import type { Recipe } from '../../types';

interface SelectedRecipeViewProps {
  recipe: Recipe | null;
  onClear: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const SelectedRecipeView: React.FC<SelectedRecipeViewProps> = ({
  recipe,
  onClear,
  onEdit,
  onDelete
}) => {
  if (!recipe) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Selected Recipe</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No recipe selected</p>
            <p className="text-sm text-gray-400 mt-2">
              Click "View" on any recipe to see details here
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
            Selected Recipe
            <span className="badge badge-secondary">{recipe.name}</span>
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
          <div>
            <h3 className="font-semibold text-lg mb-2">Recipe Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{recipe.name}</span>
              </div>
              {recipe.description && (
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="ml-2 text-sm mt-1">{recipe.description}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">Recipe ID:</span>
                <span className="ml-2 text-sm">{recipe.id}</span>
              </div>
              <div>
                <span className="text-gray-600">User ID:</span>
                <span className="ml-2 text-sm">{recipe.user_id}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Instructions</h3>
              <div className="bg-base-300 p-3 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{recipe.instructions}</p>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredient_associations && recipe.ingredient_associations.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Ingredients ({recipe.ingredient_associations.length})
              </h3>
              <div className="space-y-2">
                {recipe.ingredient_associations.map((assoc, index) => (
                  <div key={index} className="flex justify-between items-center bg-base-300 p-2 rounded">
                    <span className="font-medium">{assoc.ingredient.name}</span>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{assoc.quantity}</span>
                      <span className="ml-1">{assoc.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Summary (if we can calculate it) */}
          {recipe.ingredient_associations && recipe.ingredient_associations.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {recipe.ingredient_associations.map((assoc, index) => {
                  const ingredient = assoc.ingredient;
                  const quantity = assoc.quantity;
                  
                  // Calculate nutritional values based on quantity (assuming per 100g base)
                  const multiplier = quantity / 100;
                  const calories = (ingredient.calories_per_100g || 0) * multiplier;
                  const protein = (ingredient.protein_per_100g || 0) * multiplier;
                  const carbs = (ingredient.carbs_per_100g || 0) * multiplier;
                  const fat = (ingredient.fat_per_100g || 0) * multiplier;

                  return (
                    <div key={index} className="bg-base-300 p-2 rounded text-center">
                      <div className="font-medium text-xs">{ingredient.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        <div>{Math.round(calories)} cal</div>
                        <div>{Math.round(protein * 10) / 10}g protein</div>
                        <div>{Math.round(carbs * 10) / 10}g carbs</div>
                        <div>{Math.round(fat * 10) / 10}g fat</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end pt-4">
            {onEdit && (
              <button 
                className="btn btn-outline"
                onClick={() => onEdit(recipe.id)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-outline btn-error"
                onClick={() => onDelete(recipe.id)}
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
