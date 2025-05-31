import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all ingredients
  const fetchIngredients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/ingredients/');
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single ingredient
  const fetchIngredient = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/ingredients/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ingredient with ID ${id}`);
      }
      const data = await response.json();
      setSelectedIngredient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load ingredients when component mounts
  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Ingredients Data</h1>
          <button 
            className="btn btn-primary" 
            onClick={fetchIngredients}
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
          {/* All Ingredients */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Ingredients ({ingredients.length})</h2>
              <div className="overflow-auto max-h-96">
                <pre className="text-xs bg-base-300 p-4 rounded">
                  {JSON.stringify(ingredients, null, 2)}
                </pre>
              </div>
              <div className="card-actions justify-end">
                <div className="flex flex-wrap gap-2">
                  {ingredients.slice(0, 5).map(ingredient => (
                    <button 
                      key={ingredient.id}
                      className="btn btn-sm btn-outline"
                      onClick={() => fetchIngredient(ingredient.id)}
                    >
                      View {ingredient.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Ingredient */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                Selected Ingredient
                {selectedIngredient && (
                  <span className="badge badge-secondary">{selectedIngredient.name}</span>
                )}
              </h2>
              <div className="overflow-auto max-h-96">
                <pre className="text-xs bg-base-300 p-4 rounded">
                  {selectedIngredient 
                    ? JSON.stringify(selectedIngredient, null, 2)
                    : "No ingredient selected"
                  }
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Ingredients</div>
            <div className="stat-value">{ingredients.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Avg Calories</div>
            <div className="stat-value">
              {ingredients.length > 0 
                ? Math.round(ingredients.reduce((sum, ing) => sum + ing.calories, 0) / ingredients.length)
                : 0
              }
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">High Protein (20g)</div>
            <div className="stat-value">
              {ingredients.filter(ing => ing.protein > 20).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;