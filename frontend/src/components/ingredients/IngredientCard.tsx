import React from 'react';
import type { Ingredient } from '../../types';

interface IngredientCardProps {
  ingredient: Ingredient;
  onView?: (id: number) => void;
  isSelected?: boolean;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onView,
  isSelected = false
}) => {
  const cardClass = `card bg-base-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
    isSelected ? 'ring-2 ring-primary' : ''
  }`;

  const handleCardClick = () => {
    if (onView) {
      onView(ingredient.id);
    }
  };

  return (
    <div className={cardClass} onClick={handleCardClick}>
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">{ingredient.name}</h3>
          {ingredient.category && (
            <span className="badge badge-secondary whitespace-normal text-center leading-tight min-h-fit py-1">
              {ingredient.category}
            </span>
          )}
        </div>
        
        {/* Nutrition info per 100g - restructured to prevent overflow */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Per 100g:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="stat-item">
              <span className="text-gray-600">Calories:</span>
              <span className="font-semibold ml-1">
                {ingredient.calories_per_100g || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="text-gray-600">Protein:</span>
              <span className="font-semibold ml-1">
                {ingredient.protein_per_100g || 0}g
              </span>
            </div>
            <div className="stat-item">
              <span className="text-gray-600">Carbs:</span>
              <span className="font-semibold ml-1">
                {ingredient.carbs_per_100g || 0}g
              </span>
            </div>
            <div className="stat-item">
              <span className="text-gray-600">Fat:</span>
              <span className="font-semibold ml-1">
                {ingredient.fat_per_100g || 0}g
              </span>
            </div>
          </div>
        </div>

        {(ingredient.fiber_per_100g !== undefined || ingredient.sugar_per_100g !== undefined || ingredient.sodium_per_100g !== undefined) && (
          <div className="grid grid-cols-3 gap-2 text-xs mt-2 pt-2 border-t">
            {ingredient.fiber_per_100g !== undefined && (
              <div>
                <span className="text-gray-500">Fiber:</span>
                <span className="ml-1">{ingredient.fiber_per_100g || 0}g</span>
              </div>
            )}
            {ingredient.sugar_per_100g !== undefined && (
              <div>
                <span className="text-gray-500">Sugar:</span>
                <span className="ml-1">{ingredient.sugar_per_100g || 0}g</span>
              </div>
            )}
            {ingredient.sodium_per_100g !== undefined && (
              <div>
                <span className="text-gray-500">Sodium:</span>
                <span className="ml-1">{ingredient.sodium_per_100g || 0}mg</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
