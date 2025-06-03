export interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeIngredient {
  ingredient_id: number;
  amount: number;
  unit: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  user_id: number;
  ingredient_associations: RecipeIngredient[];
}

export interface MealSlot {
  day: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe | null;
}

export interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  recipe_id: number;
  day_of_week: string;
  meal_type: string;
  recipe: Recipe;
}

export interface SavedMealPlan {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  meal_plan_items: MealPlanItem[];
}

export interface WeeklyAssignment {
  id?: number;
  week_start_date: string; // ISO date string (Monday of that week)
  meal_plan_id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  meal_plan: SavedMealPlan;
}

export interface CalendarWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  assignment?: WeeklyAssignment;
}

export interface MonthlyStats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  uniqueRecipes: number;
  assignedWeeks: number;
  totalWeeks: number;
}
