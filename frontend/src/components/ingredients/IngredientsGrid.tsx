import React, { useState } from 'react';
import { IngredientCard } from './IngredientCard';
import type { Ingredient } from '../../types';

interface IngredientsGridProps {
  ingredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  onView: (id: number) => void;
  loading?: boolean;
}

export const IngredientsGrid: React.FC<IngredientsGridProps> = ({
  ingredients,
  selectedIngredient,
  onView,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories for filter
  const categories = Array.from(
    new Set(
      ingredients
        .map(ing => ing.category)
        .filter(category => category && category.trim() !== '')
    )
  ).sort();

  // Filter ingredients based on search and category
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Loading Ingredients...</h2>
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
            All Ingredients ({filteredIngredients.length})
          </h2>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="form-control flex-1">
            <input
              type="text"
              placeholder="Search ingredients..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <select
              className="select select-bordered"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredients Grid */}
        {filteredIngredients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || selectedCategory 
                ? 'No ingredients match your filters.' 
                : 'No ingredients found. Create your first ingredient!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredIngredients.map(ingredient => (
              <IngredientCard
                key={ingredient.id}
                ingredient={ingredient}
                onView={onView}
                isSelected={selectedIngredient?.id === ingredient.id}
              />
            ))}
          </div>
        )}

        {/* Quick stats for filtered results */}
        {filteredIngredients.length > 0 && (searchTerm || selectedCategory) && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredIngredients.length} of {ingredients.length} ingredients
          </div>
        )}
      </div>
    </div>
  );
};
