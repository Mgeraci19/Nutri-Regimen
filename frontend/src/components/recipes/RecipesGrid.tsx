import React, { useState } from 'react';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../../types';

interface RecipesGridProps {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

export const RecipesGrid: React.FC<RecipesGridProps> = ({
  recipes,
  selectedRecipe,
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter recipes based on search
  const filteredRecipes = recipes.filter(recipe => {
    const matchesName = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDescription = recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesIngredients = recipe.ingredient_associations?.some(assoc => 
      assoc.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || false;
    
    return matchesName || matchesDescription || matchesIngredients;
  });

  if (loading) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Loading Recipes...</h2>
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">
            All Recipes ({filteredRecipes.length})
          </h2>
        </div>

        {/* Search Control */}
        <div className="form-control mb-4">
          <input
            type="text"
            placeholder="Search recipes by name, description, or ingredients..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm 
                ? 'No recipes match your search.' 
                : 'No recipes found. Create your first recipe!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                isSelected={selectedRecipe?.id === recipe.id}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* Quick stats for filtered results */}
        {filteredRecipes.length > 0 && searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </div>
        )}
      </div>
    </div>
  );
};
