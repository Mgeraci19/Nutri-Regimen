import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiClient';
import MealPlanGrid from '../components/MealPlanGrid';

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

interface MealSlot {
  day: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe | null;
}

interface SavedMealPlan {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  meal_plan_items: MealPlanItem[];
}

interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  recipe_id: number;
  day_of_week: string;
  meal_type: string;
  recipe: Recipe;
}

const MealPlan = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<MealSlot[]>([]);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<SavedMealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [mealPlanName, setMealPlanName] = useState<string>('');
  const [saveAsNew, setSaveAsNew] = useState<boolean>(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  // Initialize meal plan structure
  useEffect(() => {
    const initialMealPlan: MealSlot[] = [];
    daysOfWeek.forEach(day => {
      mealTypes.forEach(meal => {
        initialMealPlan.push({
          day,
          meal,
          recipe: null
        });
      });
    });
    setMealPlan(initialMealPlan);
  }, []);

  // Fetch recipes
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

  // Fetch saved meal plans
  const fetchSavedMealPlans = async () => {
    try {
      const data = await apiFetch<SavedMealPlan[]>('/users/1/meal-plans/'); // Using user_id = 1 for now
      setSavedMealPlans(data);
    } catch (err) {
      console.error('Error fetching saved meal plans:', err);
    }
  };

  // Load recipes and saved meal plans when component mounts
  useEffect(() => {
    fetchRecipes();
    fetchSavedMealPlans();
  }, []);

  // Save meal plan to database
  const saveMealPlan = async () => {
    if (!mealPlanName.trim()) {
      setError('Please enter a meal plan name');
      return;
    }

    const filledSlots = mealPlan.filter(slot => slot.recipe);
    
    if (filledSlots.length === 0) {
      setError('Please add at least one recipe to your meal plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mealPlanData = {
        name: mealPlanName,
        meal_plan_items: filledSlots.map(slot => ({
          recipe_id: slot.recipe!.id,
          day_of_week: slot.day,
          meal_type: slot.meal
        }))
      };

      let savedPlan: SavedMealPlan;
      if (currentMealPlan && !saveAsNew) {
        // Update existing meal plan
        savedPlan = await apiFetch<SavedMealPlan>(`/meal-plans/${currentMealPlan.id}`, {
          method: 'PUT',
          body: JSON.stringify(mealPlanData),
        });
      } else {
        // Create new meal plan
        savedPlan = await apiFetch<SavedMealPlan>('/meal-plans/?user_id=1', {
          method: 'POST',
          body: JSON.stringify(mealPlanData),
        });
      }

      console.log('Saved meal plan:', savedPlan);
      
      if (!saveAsNew && currentMealPlan) {
        setCurrentMealPlan(savedPlan);
      } else {
        setCurrentMealPlan(savedPlan);
      }
      
      setMealPlanName('');
      setShowSaveModal(false);
      setSaveAsNew(false);
      await fetchSavedMealPlans();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load meal plan from database
  const loadMealPlan = async (savedPlan: SavedMealPlan) => {
    // Clear current meal plan
    const clearedPlan = mealPlan.map(slot => ({ ...slot, recipe: null }));
    
    // Load recipes from saved plan
    const loadedPlan = clearedPlan.map(slot => {
      const savedItem = savedPlan.meal_plan_items.find(
        item => item.day_of_week === slot.day && item.meal_type === slot.meal
      );
      
      return savedItem ? { ...slot, recipe: savedItem.recipe } : slot;
    });
    
    setMealPlan(loadedPlan);
    setCurrentMealPlan(savedPlan);
    setShowLoadModal(false);
  };

  // Delete saved meal plan
  const deleteSavedMealPlan = async (mealPlanId: number) => {
    setLoading(true);
    try {
      await apiFetch(`/meal-plans/${mealPlanId}`, { method: 'DELETE' });
      await fetchSavedMealPlans(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Assign recipe to meal slot
  const assignRecipeToSlot = (day: string, meal: string, recipe: Recipe | null) => {
    setMealPlan(prevPlan => 
      prevPlan.map(slot => 
        slot.day === day && slot.meal === meal 
          ? { ...slot, recipe }
          : slot
      )
    );
  };

  // Get recipe for specific slot
  const getRecipeForSlot = (day: string, meal: string): Recipe | null => {
    const slot = mealPlan.find(s => s.day === day && s.meal === meal);
    return slot?.recipe || null;
  };

  // Calculate total nutrition for a day
  const calculateDayNutrition = (day: string) => {
    const dayMeals = mealPlan.filter(slot => slot.day === day && slot.recipe);
    
    return dayMeals.reduce((total, slot) => {
      if (!slot.recipe) return total;
      
      const recipeNutrition = slot.recipe.ingredient_associations.reduce((recipeTotal, ingredient) => {
        const factor = ingredient.amount / 100;
        return {
          calories: recipeTotal.calories + (ingredient.ingredient.calories * factor),
          protein: recipeTotal.protein + (ingredient.ingredient.protein * factor),
          carbs: recipeTotal.carbs + (ingredient.ingredient.carbs * factor),
          fat: recipeTotal.fat + (ingredient.ingredient.fat * factor)
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      return {
        calories: total.calories + recipeNutrition.calories,
        protein: total.protein + recipeNutrition.protein,
        carbs: total.carbs + recipeNutrition.carbs,
        fat: total.fat + recipeNutrition.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Clear meal plan
  const clearMealPlan = () => {
    setMealPlan(prevPlan => 
      prevPlan.map(slot => ({ ...slot, recipe: null }))
    );
    setCurrentMealPlan(null);
  };

  const openSaveModal = () => {
    if (currentMealPlan) {
      setMealPlanName(currentMealPlan.name);
      setSaveAsNew(false);
    } else {
      setMealPlanName('');
      setSaveAsNew(true);
    }
    setShowSaveModal(true);
  };

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
            {currentMealPlan && (
              <div className="text-sm opacity-70 mt-1">
                Currently loaded: <span className="font-medium text-primary">{currentMealPlan.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              className="btn btn-info" 
              onClick={() => setShowLoadModal(true)}
            >
              Load Plan
            </button>
            <button 
              className="btn btn-success" 
              onClick={openSaveModal}
              disabled={mealPlan.filter(slot => slot.recipe).length === 0}
            >
              Save Plan
            </button>
            <button 
              className="btn btn-warning" 
              onClick={clearMealPlan}
            >
              Clear Plan
            </button>
            <button 
              className="btn btn-primary" 
              onClick={fetchRecipes}
              disabled={loading}
            >
              Refresh Recipes
            </button>
          </div>
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Save Meal Plan</h3>
              <div className="py-4">
                {currentMealPlan && (
                  <div className="mb-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Update existing plan: "{currentMealPlan.name}"</span>
                        <input 
                          type="radio" 
                          name="save-option" 
                          className="radio checked:bg-primary" 
                          checked={!saveAsNew}
                          onChange={() => {
                            setSaveAsNew(false);
                            setMealPlanName(currentMealPlan.name);
                          }}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Save as new plan</span>
                        <input 
                          type="radio" 
                          name="save-option" 
                          className="radio checked:bg-primary" 
                          checked={saveAsNew}
                          onChange={() => {
                            setSaveAsNew(true);
                            setMealPlanName('');
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {saveAsNew || !currentMealPlan ? 'New Meal Plan Name' : 'Meal Plan Name'}
                    </span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter meal plan name" 
                    className="input input-bordered"
                    value={mealPlanName}
                    onChange={(e) => setMealPlanName(e.target.value)}
                    disabled={!saveAsNew && currentMealPlan}
                  />
                </div>
                <div className="mt-4 text-sm">
                  <strong>Meals to save:</strong> {mealPlan.filter(slot => slot.recipe).length} recipes
                </div>
              </div>
              <div className="modal-action">
                <button 
                  className="btn btn-success"
                  onClick={saveMealPlan}
                  disabled={loading || !mealPlanName.trim()}
                >
                  {loading ? 'Saving...' : (saveAsNew || !currentMealPlan ? 'Save New' : 'Update')}
                </button>
                <button 
                  className="btn"
                  onClick={() => {
                    setShowSaveModal(false);
                    setMealPlanName('');
                    setSaveAsNew(false);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load Modal */}
        {showLoadModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Load Meal Plan</h3>
              <div className="py-4">
                {savedMealPlans.length === 0 ? (
                  <p>No saved meal plans found.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {savedMealPlans.map(plan => (
                      <div key={plan.id} className="card bg-base-200 p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm opacity-70">
                              {plan.meal_plan_items.length} meals • Created {new Date(plan.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => loadMealPlan(plan)}
                            >
                              Load
                            </button>
                            <button 
                              className="btn btn-sm btn-error"
                              onClick={() => deleteSavedMealPlan(plan.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => setShowLoadModal(false)}
                >
                  Close
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

        <MealPlanGrid
          recipes={recipes}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          daysOfWeek={daysOfWeek}
          mealTypes={mealTypes}
          getRecipeForSlot={getRecipeForSlot}
          assignRecipeToSlot={assignRecipeToSlot}
          calculateDayNutrition={calculateDayNutrition}
          mealPlan={mealPlan}
          savedMealPlans={savedMealPlans}
        />
      </div>
    </div>
  );
};

export default MealPlan;