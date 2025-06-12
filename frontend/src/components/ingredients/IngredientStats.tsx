import React from 'react';
import type { Ingredient } from '../../types';

interface IngredientStatsProps {
  ingredients: Ingredient[];
}

export const IngredientStats: React.FC<IngredientStatsProps> = ({ ingredients }) => {
  const totalIngredients = ingredients.length;
  
  const avgCalories = totalIngredients > 0 
    ? Math.round(ingredients.reduce((sum, ing) => sum + (ing.calories_per_100g || 0), 0) / totalIngredients)
    : 0;
  
  const highProteinCount = ingredients.filter(ing => (ing.protein_per_100g || 0) > 20).length;
  
  const categoriesCount = new Set(
    ingredients
      .map(ing => ing.category)
      .filter(category => category && category.trim() !== '')
  ).size;

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Total Ingredients</div>
        <div className="stat-value">{totalIngredients}</div>
        <div className="stat-desc">In database</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Avg Calories</div>
        <div className="stat-value">{avgCalories}</div>
        <div className="stat-desc">Per 100g</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">High Protein</div>
        <div className="stat-value">{highProteinCount}</div>
        <div className="stat-desc">&gt;20g protein</div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Categories</div>
        <div className="stat-value">{categoriesCount}</div>
        <div className="stat-desc">Unique types</div>
      </div>
    </div>
  );
};
