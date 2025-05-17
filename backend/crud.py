from sqlalchemy.orm import Session
from typing import List, Optional
import models
from pydantic import BaseModel

# User schemas
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

# Food schemas
class FoodCreate(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float

class FoodUpdate(BaseModel):
    name: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

# Meal schemas
class MealCreate(BaseModel):
    name: str
    user_id: int
    food_ids: List[int] = []

class MealUpdate(BaseModel):
    name: Optional[str] = None
    food_ids: Optional[List[int]] = None

# User CRUD operations
def create_user(db: Session, user: UserCreate):
    # In a real application, you would hash the password
    fake_hashed_password = user.password + "_hashed"
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=fake_hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        user_data = user.dict(exclude_unset=True)
        if "password" in user_data:
            user_data["hashed_password"] = user_data.pop("password") + "_hashed"
        for key, value in user_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

# Food CRUD operations
def create_food(db: Session, food: FoodCreate):
    db_food = models.Food(**food.dict())
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def get_food(db: Session, food_id: int):
    return db.query(models.Food).filter(models.Food.id == food_id).first()

def get_foods(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Food).offset(skip).limit(limit).all()

def update_food(db: Session, food_id: int, food: FoodUpdate):
    db_food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if db_food:
        food_data = food.dict(exclude_unset=True)
        for key, value in food_data.items():
            setattr(db_food, key, value)
        db.commit()
        db.refresh(db_food)
    return db_food

def delete_food(db: Session, food_id: int):
    db_food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if db_food:
        db.delete(db_food)
        db.commit()
    return db_food

# Meal CRUD operations
def create_meal(db: Session, meal: MealCreate):
    db_meal = models.Meal(name=meal.name, user_id=meal.user_id)
    
    # Add foods to the meal
    if meal.food_ids:
        foods = db.query(models.Food).filter(models.Food.id.in_(meal.food_ids)).all()
        db_meal.foods = foods
    
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    return db_meal

def get_meal(db: Session, meal_id: int):
    return db.query(models.Meal).filter(models.Meal.id == meal_id).first()

def get_meals(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Meal).offset(skip).limit(limit).all()

def get_user_meals(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Meal).filter(models.Meal.user_id == user_id).offset(skip).limit(limit).all()

def update_meal(db: Session, meal_id: int, meal: MealUpdate):
    db_meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if db_meal:
        if meal.name:
            db_meal.name = meal.name
        
        if meal.food_ids is not None:
            foods = db.query(models.Food).filter(models.Food.id.in_(meal.food_ids)).all()
            db_meal.foods = foods
        
        db.commit()
        db.refresh(db_meal)
    return db_meal

def delete_meal(db: Session, meal_id: int):
    db_meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if db_meal:
        db.delete(db_meal)
        db.commit()
    return db_meal
