from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# Ingredient schemas
class IngredientBase(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class Ingredient(IngredientBase):
    id: int
    
    class Config:
        from_attributes = True

# Recipe ingredient association schemas
class RecipeIngredientBase(BaseModel):
    ingredient_id: int
    amount: float
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

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientCreate]

class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    ingredients: Optional[List[RecipeIngredientCreate]] = None

class Recipe(RecipeBase):
    id: int
    user_id: int
    ingredient_associations: List[RecipeIngredient] = []
    
    class Config:
        from_attributes = True

# Extended User schema with recipes
class UserWithRecipes(User):
    recipes: List[Recipe] = []

    class Config:
        from_attributes = True

# Legacy schemas (keeping for compatibility if needed)
class FoodBase(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class FoodCreate(FoodBase):
    pass

class FoodUpdate(BaseModel):
    name: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class Food(FoodBase):
    id: int

    class Config:
        from_attributes = True

# Meal schemas
class MealBase(BaseModel):
    name: str

class MealCreate(MealBase):
    user_id: int
    food_ids: List[int] = []

class MealUpdate(BaseModel):
    name: Optional[str] = None
    food_ids: Optional[List[int]] = None

class Meal(MealBase):
    id: int
    date: datetime
    user_id: int
    foods: List[Food] = []

    class Config:
        from_attributes = True

# Extended User schema with meals
class UserWithMeals(User):
    meals: List[Meal] = []

    class Config:
        from_attributes = True