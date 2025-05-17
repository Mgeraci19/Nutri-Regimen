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
    is_active: bool

    class Config:
        orm_mode = True

# Food schemas
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
        orm_mode = True

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
        orm_mode = True

# Extended User schema with meals
class UserWithMeals(User):
    meals: List[Meal] = []

    class Config:
        orm_mode = True
