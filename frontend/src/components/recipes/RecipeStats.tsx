import React from 'react';
import type { Recipe } from '../../types';

interface RecipeStatsProps {
  recipes: Recipe[];
}

export const RecipeStats: React.FC<RecipeStatsProps> = ({ recipes }) => {
  const totalRecipes = recipes.length;
  
  const avgIngredients = totalRecipes > 0 
    ? Math.round(recipes.reduce((sum, recipe) => sum + (recipe.ingredient_associations?.length || 0), 0) / totalRecipes)
    : 0;
  
  const uniqueUsers = new Set(recipes.map(recipe => recipe.user_id)).size;
  
  const totalIngredients = recipes.reduce((sum, recipe) => sum + (recipe.ingredient_associations?.length || 0), 0);

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Total Recipes</div>
        <div className="stat-value">{totalRecipes}</div>
        <div className="stat-desc">In database</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Avg Ingredients</div>
        <div className="stat-value">{avgIngredients}</div>
        <div className="stat-desc">Per recipe</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Total Ingredients</div>
        <div className="stat-value">{totalIngredients}</div>
        <div className="stat-desc">Used across all recipes</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Users</div>
        <div className="stat-value">{uniqueUsers}</div>
        <div className="stat-desc">Recipe creators</div>
      </div>
    </div>
  );
};
