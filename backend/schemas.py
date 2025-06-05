from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

# User schemas
class UserBase(BaseModel):
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    # No password field - handled by Supabase
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class User(UserBase):
    id: int
    supabase_user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Ingredient schemas
class IngredientBase(BaseModel):
    name: str
    category: Optional[str] = None
    calories_per_100g: Optional[int] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None
    sugar_per_100g: Optional[float] = None
    sodium_per_100g: Optional[float] = None

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    calories_per_100g: Optional[int] = None
    protein_per_100g: Optional[float] = None
    carbs_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None
    sugar_per_100g: Optional[float] = None
    sodium_per_100g: Optional[float] = None

class Ingredient(IngredientBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Recipe ingredient association schemas
class RecipeIngredientBase(BaseModel):
    ingredient_id: int
    quantity: float  # Changed from 'amount' to 'quantity' to match database
    unit: str

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredient(RecipeIngredientBase):
    ingredient: Ingredient
    
    class Config:
        from_attributes = True

# Recipe schemas
class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    is_public: Optional[str] = "false"

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientCreate]

class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    is_public: Optional[str] = None
    ingredients: Optional[List[RecipeIngredientCreate]] = None

class Recipe(RecipeBase):
    id: int
    user_id: Optional[int] = None  # Nullable for public recipes
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    ingredient_associations: List[RecipeIngredient] = []
    
    class Config:
        from_attributes = True

# Meal Plan Item schemas
class MealPlanItemBase(BaseModel):
    recipe_id: int
    day_of_week: str
    meal_type: str

class MealPlanItemCreate(MealPlanItemBase):
    pass

class MealPlanItem(MealPlanItemBase):
    id: int
    meal_plan_id: int
    recipe: Recipe
    
    class Config:
        from_attributes = True

# Meal Plan schemas
class MealPlanBase(BaseModel):
    name: str
    is_template: Optional[str] = "false"

class MealPlanCreate(MealPlanBase):
    meal_plan_items: List[MealPlanItemCreate]

class MealPlanUpdate(BaseModel):
    name: Optional[str] = None
    is_template: Optional[str] = None

class MealPlan(MealPlanBase):
    id: int
    user_id: Optional[int] = None  # Nullable for template meal plans
    created_at: datetime
    updated_at: datetime
    meal_plan_items: List[MealPlanItem] = []
    
    class Config:
        from_attributes = True

# Weekly Assignment schemas
class WeeklyAssignmentBase(BaseModel):
    week_start_date: date  # Use date type instead of string
    meal_plan_id: int

class WeeklyAssignmentCreate(WeeklyAssignmentBase):
    user_id: Optional[int] = None

class WeeklyAssignment(WeeklyAssignmentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Extended User schema with meal plans
class UserWithMealPlans(User):
    meal_plans: List[MealPlan] = []

    class Config:
        from_attributes = True

# Extended User schema with recipes
class UserWithRecipes(User):
    recipes: List[Recipe] = []

    class Config:
        from_attributes = True
