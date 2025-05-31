import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeIngredient {
  ingredient_id: number;
  amount: number;
  unit: string;
  ingredient: Ingredient;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  user_id: number;
  ingredient_associations: RecipeIngredient[];
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/recipes/');
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single recipe
  const fetchRecipe = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe with ID ${id}`);
      }
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load recipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Recipes Data</h1>
          <button 
            className="btn btn-primary" 
            onClick={fetchRecipes}
            disabled={loading}
          >
            Refresh Data
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* All Recipes */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Recipes ({recipes.length})</h2>
              <div className="overflow-auto max-h-96">
                <pre className="text-xs bg-base-300 p-4 rounded">
                  {JSON.stringify(recipes, null, 2)}
                </pre>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-wrap gap-2">
                  {recipes.map(recipe => (
                    <button 
                      key={recipe.id}
                      className="btn btn-sm btn-outline"
                      onClick={() => fetchRecipe(recipe.id)}
                    >
                      View {recipe.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Recipe */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Selected Recipe
                {selectedRecipe && (
                  <span className="badge badge-secondary">{selectedRecipe.name}</span>
                )}
              </h2>
              <div className="overflow-auto max-h-96">
                <pre className="text-xs bg-base-300 p-4 rounded">
                  {selectedRecipe 
                    ? JSON.stringify(selectedRecipe, null, 2)
                    : "No recipe selected"
                  }
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Stats */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Recipes</div>
            <div className="stat-value">{recipes.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Avg Ingredients</div>
            <div className="stat-value">
              {recipes.length > 0 
                ? Math.round(recipes.reduce((sum, recipe) => sum + recipe.ingredient_associations.length, 0) / recipes.length)
                : 0
              }
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Users</div>
            <div className="stat-value">
              {new Set(recipes.map(recipe => recipe.user_id)).size}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;