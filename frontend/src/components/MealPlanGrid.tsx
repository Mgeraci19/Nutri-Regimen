import React from 'react';
import { Recipe, MealSlot, SavedMealPlan } from '../types';

interface Props {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (r: Recipe | null) => void;
  daysOfWeek: string[];
  mealTypes: readonly string[];
  getRecipeForSlot: (day: string, meal: string) => Recipe | null;
  assignRecipeToSlot: (day: string, meal: string, recipe: Recipe | null) => void;
  calculateDayNutrition: (day: string) => { calories: number; protein: number; carbs: number; fat: number };
  mealPlan: MealSlot[];
  savedMealPlans: SavedMealPlan[];
}

const MealPlanGrid: React.FC<Props> = ({
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  daysOfWeek,
  mealTypes,
  getRecipeForSlot,
  assignRecipeToSlot,
  calculateDayNutrition,
  mealPlan,
  savedMealPlans,
}) => {
  return (
    <>
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
                                  recipe ? 'bg-success/20 border-success hover:bg-success/30' : 'bg-base-100 border-base-300 hover:bg-base-300'
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
        <div className="stat">
          <div className="stat-title">Saved Plans</div>
          <div className="stat-value">{savedMealPlans.length}</div>
        </div>
      </div>
    </>
  );
};

export default MealPlanGrid;
