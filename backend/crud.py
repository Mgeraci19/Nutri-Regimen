from sqlalchemy.orm import Session
from typing import List, Optional
import models
from schemas import UserCreate, IngredientCreate, RecipeCreate, MealPlanCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD operations
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Ingredient CRUD operations
def create_ingredient(db: Session, ingredient: IngredientCreate):
    db_ingredient = models.Ingredient(**ingredient.dict())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

def get_ingredient(db: Session, ingredient_id: int):
    return db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()

def get_ingredients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Ingredient).offset(skip).limit(limit).all()

# Recipe CRUD operations
def create_recipe(db: Session, recipe: RecipeCreate, user_id: int):
    db_recipe = models.Recipe(
        name=recipe.name,
        description=recipe.description,
        instructions=recipe.instructions,
        user_id=user_id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    
    # Add recipe ingredients
    for recipe_ingredient in recipe.ingredients:
        db_recipe_ingredient = models.RecipeIngredient(
            recipe_id=db_recipe.id,
            ingredient_id=recipe_ingredient.ingredient_id,
            amount=recipe_ingredient.amount,
            unit=recipe_ingredient.unit
        )
        db.add(db_recipe_ingredient)
    
    db.commit()
    return db_recipe

def get_recipe(db: Session, recipe_id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()

# Meal Plan CRUD operations
def create_meal_plan(db: Session, meal_plan: MealPlanCreate, user_id: int):
    db_meal_plan = models.MealPlan(
        name=meal_plan.name,
        user_id=user_id
    )
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    
    # Add meal plan items
    for item in meal_plan.meal_plan_items:
        db_meal_plan_item = models.MealPlanItem(
            meal_plan_id=db_meal_plan.id,
            recipe_id=item.recipe_id,
            day_of_week=item.day_of_week,
            meal_type=item.meal_type
        )
        db.add(db_meal_plan_item)
    
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan

def get_meal_plan(db: Session, meal_plan_id: int):
    return db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()

def get_meal_plans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MealPlan).offset(skip).limit(limit).all()

def get_user_meal_plans(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.MealPlan).filter(models.MealPlan.user_id == user_id).offset(skip).limit(limit).all()

def delete_meal_plan(db: Session, meal_plan_id: int):
    db_meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()
    if db_meal_plan:
        db.delete(db_meal_plan)
        db.commit()
    return db_meal_plan

def update_meal_plan(db: Session, meal_plan_id: int, meal_plan: MealPlanCreate):
    db_meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == meal_plan_id).first()
    if not db_meal_plan:
        return None
    
    # Update meal plan name
    db_meal_plan.name = meal_plan.name
    
    # Delete existing meal plan items
    db.query(models.MealPlanItem).filter(models.MealPlanItem.meal_plan_id == meal_plan_id).delete()
    
    # Add new meal plan items
    for item in meal_plan.meal_plan_items:
        db_meal_plan_item = models.MealPlanItem(
            meal_plan_id=db_meal_plan.id,
            recipe_id=item.recipe_id,
            day_of_week=item.day_of_week,
            meal_type=item.meal_type
        )
        db.add(db_meal_plan_item)
    
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan
