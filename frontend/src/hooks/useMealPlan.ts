import { useState, useEffect } from 'react';
import { apiFetch } from '../apiClient';
import { Recipe, MealSlot, SavedMealPlan } from '../types';

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

export function useMealPlan() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlan, setMealPlan] = useState<MealSlot[]>([]);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<SavedMealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialMealPlan: MealSlot[] = [];
    daysOfWeek.forEach(day => {
      mealTypes.forEach(meal => {
        initialMealPlan.push({ day, meal, recipe: null });
      });
    });
    setMealPlan(initialMealPlan);
  }, []);

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

  const fetchSavedMealPlans = async () => {
    try {
      const data = await apiFetch<SavedMealPlan[]>('/users/1/meal-plans/');
      setSavedMealPlans(data);
    } catch (err) {
      console.error('Error fetching saved meal plans:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchSavedMealPlans();
  }, []);

  const saveMealPlan = async (name: string, saveAsNew: boolean) => {
    if (!name.trim()) {
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
        name,
        meal_plan_items: filledSlots.map(slot => ({
          recipe_id: slot.recipe!.id,
          day_of_week: slot.day,
          meal_type: slot.meal,
        })),
      };

      let savedPlan: SavedMealPlan;
      if (currentMealPlan && !saveAsNew) {
        savedPlan = await apiFetch<SavedMealPlan>(`/meal-plans/${currentMealPlan.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mealPlanData),
        });
      } else {
        savedPlan = await apiFetch<SavedMealPlan>('/meal-plans/?user_id=1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mealPlanData),
        });
      }

      setCurrentMealPlan(savedPlan);
      await fetchSavedMealPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMealPlan = (savedPlan: SavedMealPlan) => {
    const clearedPlan = mealPlan.map(slot => ({ ...slot, recipe: null }));
    const loadedPlan = clearedPlan.map(slot => {
      const savedItem = savedPlan.meal_plan_items.find(
        item => item.day_of_week === slot.day && item.meal_type === slot.meal
      );
      return savedItem ? { ...slot, recipe: savedItem.recipe } : slot;
    });

    setMealPlan(loadedPlan);
    setCurrentMealPlan(savedPlan);
  };

  const deleteSavedMealPlan = async (mealPlanId: number) => {
    setLoading(true);
    try {
      await apiFetch(`/meal-plans/${mealPlanId}`, { method: 'DELETE' });
      await fetchSavedMealPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const assignRecipeToSlot = (day: string, meal: string, recipe: Recipe | null) => {
    setMealPlan(prev =>
      prev.map(slot =>
        slot.day === day && slot.meal === meal ? { ...slot, recipe } : slot
      )
    );
  };

  const getRecipeForSlot = (day: string, meal: string): Recipe | null => {
    const slot = mealPlan.find(s => s.day === day && s.meal === meal);
    return slot?.recipe || null;
  };

  const calculateDayNutrition = (day: string) => {
    const dayMeals = mealPlan.filter(slot => slot.day === day && slot.recipe);
    return dayMeals.reduce(
      (total, slot) => {
        if (!slot.recipe) return total;
        const recipeNutrition = slot.recipe.ingredient_associations.reduce(
          (recipeTotal, ingredient) => {
            const factor = ingredient.amount / 100;
            return {
              calories: recipeTotal.calories + ingredient.ingredient.calories * factor,
              protein: recipeTotal.protein + ingredient.ingredient.protein * factor,
              carbs: recipeTotal.carbs + ingredient.ingredient.carbs * factor,
              fat: recipeTotal.fat + ingredient.ingredient.fat * factor,
            };
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        return {
          calories: total.calories + recipeNutrition.calories,
          protein: total.protein + recipeNutrition.protein,
          carbs: total.carbs + recipeNutrition.carbs,
          fat: total.fat + recipeNutrition.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const clearMealPlan = () => {
    setMealPlan(prev => prev.map(slot => ({ ...slot, recipe: null })));
    setCurrentMealPlan(null);
  };

  return {
    recipes,
    mealPlan,
    savedMealPlans,
    currentMealPlan,
    loading,
    error,
    setError,
    daysOfWeek,
    mealTypes,
    fetchRecipes,
    fetchSavedMealPlans,
    saveMealPlan,
    loadMealPlan,
    deleteSavedMealPlan,
    assignRecipeToSlot,
    getRecipeForSlot,
    calculateDayNutrition,
    clearMealPlan,
  };
}
