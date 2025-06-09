import React from 'react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onView,
  onEdit,
  onDelete,
  isSelected = false,
  showActions = false
}) => {
  const cardClass = `card bg-base-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
    isSelected ? 'ring-2 ring-primary' : ''
  }`;

  const ingredientCount = recipe.ingredient_associations?.length || 0;

  const handleCardClick = () => {
    if (!showActions && onView) {
      onView(recipe.id);
    }
  };

  return (
    <div className={cardClass} onClick={handleCardClick}>
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-lg">{recipe.name}</h3>
        </div>
        
        {recipe.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {ingredientCount > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Ingredients:</span>
            <div className="flex flex-wrap gap-1 mt-1 overflow-hidden">
              {recipe.ingredient_associations.slice(0, 2).map((assoc, index) => (
                <span key={index} className="badge badge-outline badge-xs truncate max-w-20">
                  {assoc.ingredient.name}
                </span>
              ))}
              {ingredientCount > 2 && (
                <span className="badge badge-outline badge-xs">
                  +{ingredientCount - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {showActions && (
          <div className="card-actions justify-end mt-3">
            {onEdit && (
              <button 
                className="btn btn-sm btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe.id);
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-sm btn-outline btn-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
