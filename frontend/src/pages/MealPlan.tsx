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

interface MealSlot {
  day: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe | null;
}

const MealPlan = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<MealSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{day: string, meal: string} | null>(null);

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

  // Load recipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

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
        const factor = ingredient.amount / 100; // Assuming nutrition is per 100g
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
  };

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
          <div className="flex gap-2">
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          
          {/* Recipe Selection Panel */}
          <div className="xl:col-span-1">
            <div className="card bg-base-200 shadow-xl h-fit">
              <div className="card-body">
                <h2 className="card-title">Available Recipes ({recipes.length})</h2>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {recipes.map(recipe => (
                    <div 
                      key={recipe.id}
                      className={`p-3 rounded border cursor-pointer transition-colors ${
                        selectedRecipe?.id === recipe.id 
                          ? 'bg-primary text-primary-content border-primary' 
                          : 'bg-base-100 border-base-300 hover:bg-base-300'
                      }`}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm opacity-70">{recipe.description}</div>
                      <div className="text-xs mt-1">
                        {recipe.ingredient_associations.length} ingredients
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedRecipe && (
                  <div className="mt-4 p-3 bg-primary/10 rounded">
                    <div className="font-medium text-primary">Selected Recipe</div>
                    <div className="text-sm">{selectedRecipe.name}</div>
                    <div className="text-xs mt-2">
                      Click on any meal slot to assign this recipe
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Meal Plan Grid */}
          <div className="xl:col-span-3">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Weekly Meal Plan</h2>
                
                {/* Days of the week grid */}
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th className="w-20">Meal</th>
                        {daysOfWeek.map(day => (
                          <th key={day} className="text-center min-w-32">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mealTypes.map(mealType => (
                        <tr key={mealType}>
                          <td className="font-medium capitalize bg-base-300">{mealType}</td>
                          {daysOfWeek.map(day => {
                            const recipe = getRecipeForSlot(day, mealType);
                            return (
                              <td key={`${day}-${mealType}`} className="p-1">
                                <div
                                  className={`min-h-16 p-2 rounded border-2 border-dashed cursor-pointer transition-colors ${
                                    recipe 
                                      ? 'bg-success/20 border-success hover:bg-success/30' 
                                      : 'bg-base-100 border-base-300 hover:bg-base-300'
                                  }`}
                                  onClick={() => {
                                    if (selectedRecipe) {
                                      assignRecipeToSlot(day, mealType, selectedRecipe);
                                    } else if (recipe) {
                                      assignRecipeToSlot(day, mealType, null);
                                    }
                                  }}
                                >
                                  {recipe ? (
                                    <div className="text-xs">
                                      <div className="font-medium text-success">{recipe.name}</div>
                                      <div className="opacity-70 truncate">{recipe.description}</div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-base-content/50 text-center">
                                      Click to add recipe
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Daily Nutrition Summary */}
            <div className="card bg-base-200 shadow-xl mt-4">
              <div className="card-body">
                <h2 className="card-title">Daily Nutrition Summary</h2>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Calories</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fat (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daysOfWeek.map(day => {
                        const nutrition = calculateDayNutrition(day);
                        return (
                          <tr key={day}>
                            <td className="font-medium">{day}</td>
                            <td>{Math.round(nutrition.calories)}</td>
                            <td>{Math.round(nutrition.protein)}</td>
                            <td>{Math.round(nutrition.carbs)}</td>
                            <td>{Math.round(nutrition.fat)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Summary Stats */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Meals Planned</div>
            <div className="stat-value">
              {mealPlan.filter(slot => slot.recipe).length}
            </div>
            <div className="stat-desc">out of {mealPlan.length} slots</div>
          </div>
          <div className="stat">
            <div className="stat-title">Unique Recipes Used</div>
            <div className="stat-value">
              {new Set(mealPlan.filter(slot => slot.recipe).map(slot => slot.recipe!.id)).size}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Completion</div>
            <div className="stat-value">
              {Math.round((mealPlan.filter(slot => slot.recipe).length / mealPlan.length) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;