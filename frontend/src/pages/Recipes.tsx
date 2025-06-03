import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiClient';

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

interface NewRecipeIngredient {
  ingredient_id: number;
  amount: number;
  unit: string;
}

interface NewRecipe {
  name: string;
  description: string;
  instructions: string;
  ingredients: NewRecipeIngredient[];
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newRecipe, setNewRecipe] = useState<NewRecipe>({
    name: '',
    description: '',
    instructions: '',
    ingredients: []
  });

  // Fetch all recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch<Recipe[]>('/recipes/');
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all ingredients for the dropdown
  const fetchIngredients = async () => {
    try {
      const data = await apiFetch<Ingredient[]>('/ingredients/');
      setIngredients(data);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
    }
  };

  // Fetch single recipe
  const fetchRecipe = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch<Recipe>(`/recipes/${id}`);
      setSelectedRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new recipe
  const createRecipe = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch<Recipe>('/recipes/?user_id=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });
      console.log('Created recipe:', data);
      
      // Reset form and refresh recipes list
      setNewRecipe({
        name: '',
        description: '',
        instructions: '',
        ingredients: []
      });
      setShowCreateForm(false);
      await fetchRecipes();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle recipe form input changes
  const handleRecipeInputChange = (field: keyof Omit<NewRecipe, 'ingredients'>, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add ingredient to recipe
  const addIngredientToRecipe = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient_id: 0, amount: 0, unit: 'g' }]
    }));
  };

  // Remove ingredient from recipe
  const removeIngredientFromRecipe = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Update recipe ingredient
  const updateRecipeIngredient = (index: number, field: keyof NewRecipeIngredient, value: string | number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  // Load recipes and ingredients when component mounts
  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Recipes Data</h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Add New Recipe'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={fetchRecipes}
              disabled={loading}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Create Recipe Form */}
        {showCreateForm && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Create New Recipe</h2>
              
              {/* Basic Recipe Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Recipe Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter recipe name" 
                    className="input input-bordered"
                    value={newRecipe.name}
                    onChange={(e) => handleRecipeInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea 
                    placeholder="Enter recipe description" 
                    className="textarea textarea-bordered"
                    value={newRecipe.description}
                    onChange={(e) => handleRecipeInputChange('description', e.target.value)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Instructions</span>
                  </label>
                  <textarea 
                    placeholder="Enter cooking instructions" 
                    className="textarea textarea-bordered"
                    rows={4}
                    value={newRecipe.instructions}
                    onChange={(e) => handleRecipeInputChange('instructions', e.target.value)}
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="divider">Ingredients</div>
              
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ingredient</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={ingredient.ingredient_id}
                      onChange={(e) => updateRecipeIngredient(index, 'ingredient_id', parseInt(e.target.value))}
                    >
                      <option value={0}>Select ingredient</option>
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Amount</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="0" 
                      className="input input-bordered"
                      value={ingredient.amount}
                      onChange={(e) => updateRecipeIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Unit</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={ingredient.unit}
                      onChange={(e) => updateRecipeIngredient(index, 'unit', e.target.value)}
                    >
                      <option value="g">grams (g)</option>
                      <option value="kg">kilograms (kg)</option>
                      <option value="ml">milliliters (ml)</option>
                      <option value="l">liters (l)</option>
                      <option value="cup">cup</option>
                      <option value="tbsp">tablespoon</option>
                      <option value="tsp">teaspoon</option>
                      <option value="whole">whole</option>
                      <option value="slices">slices</option>
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={() => removeIngredientFromRecipe(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2 mt-4">
                <button 
                  className="btn btn-outline"
                  onClick={addIngredientToRecipe}
                >
                  Add Ingredient
                </button>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-success"
                  onClick={createRecipe}
                  disabled={loading || !newRecipe.name.trim() || newRecipe.ingredients.length === 0}
                >
                  {loading ? 'Creating...' : 'Create Recipe'}
                </button>
              </div>
            </div>
          </div>
        )}

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