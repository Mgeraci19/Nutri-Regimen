import React, { useState, useEffect } from 'react';
import { apiFetch, checkApiHealth } from '../apiClient';

interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NewIngredient {
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
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  // Check API health
  const checkHealth = async () => {
    const healthy = await checkApiHealth();
    setApiHealthy(healthy);
    console.log(`🏥 API Health Check: ${healthy ? 'Healthy' : 'Unhealthy'}`);
  };

  // Fetch all ingredients
  const fetchIngredients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Starting to fetch ingredients...');
      const data = await apiFetch<Ingredient[]>('/ingredients/');
      console.log('✅ Successfully fetched ingredients:', data);
      setIngredients(data);
    } catch (err) {
      console.error('❌ Error in fetchIngredients:', err);
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
      const data = await apiFetch<Ingredient>(`/ingredients/${id}`);
      setSelectedIngredient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create new ingredient
  const handleCreateIngredient = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetch<Ingredient>('/ingredients/', {
        method: 'POST',
        body: JSON.stringify(newIngredient),
      });
      console.log('Created ingredient:', data);
      
      // Reset form and refresh ingredients list
      setNewIngredient({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      });
      setShowCreateForm(false);
      await fetchIngredients();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof NewIngredient, value: string | number) => {
    setNewIngredient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load ingredients when component mounts
  useEffect(() => {
    checkHealth();
    fetchIngredients();
  }, []);

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        {/* API Health Indicator */}
        <div className={`alert ${apiHealthy === true ? 'alert-success' : apiHealthy === false ? 'alert-error' : 'alert-warning'}`}>
          <span>
            API Status: {apiHealthy === true ? '✅ Connected' : apiHealthy === false ? '❌ Disconnected' : '⏳ Checking...'}
            {apiHealthy === false && (
              <>
                <br />
                <button className="btn btn-sm btn-outline mt-2" onClick={checkHealth}>
                  Retry Connection
                </button>
              </>
            )}
          </span>
        </div>

        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Ingredients Data</h1>
          <div className="flex gap-2">
            <button 
              className="btn btn-info btn-sm" 
              onClick={checkHealth}
            >
              Check API
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Add New Ingredient'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={fetchIngredients}
              disabled={loading}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Create Ingredient Form */}
        {showCreateForm && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Create New Ingredient</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ingredient name" 
                    className="input input-bordered"
                    value={newIngredient.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calories (per 100g)</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="input input-bordered"
                    value={newIngredient.calories}
                    onChange={(e) => handleInputChange('calories', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Protein (g)</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0" 
                    className="input input-bordered"
                    value={newIngredient.protein}
                    onChange={(e) => handleInputChange('protein', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Carbs (g)</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0" 
                    className="input input-bordered"
                    value={newIngredient.carbs}
                    onChange={(e) => handleInputChange('carbs', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Fat (g)</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="0" 
                    className="input input-bordered"
                    value={newIngredient.fat}
                    onChange={(e) => handleInputChange('fat', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-success"
                  onClick={handleCreateIngredient}
                  disabled={loading || !newIngredient.name.trim()}
                >
                  {loading ? 'Creating...' : 'Create Ingredient'}
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