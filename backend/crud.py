from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import models
import schemas
from schemas import UserCreate, IngredientCreate, RecipeCreate, MealPlanCreate

# User CRUD operations (Supabase authentication)
def create_user(db: Session, user: UserCreate, supabase_user_id: str):
    """Create a new user linked to Supabase auth"""
    db_user = models.User(
        supabase_user_id=supabase_user_id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        avatar_url=user.avatar_url
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

def get_user_by_supabase_id(db: Session, supabase_user_id: str):
    """Get user by Supabase user ID"""
    return db.query(models.User).filter(models.User.supabase_user_id == supabase_user_id).first()

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None
    
    # Update user fields if provided
    if user.username is not None:
        db_user.username = user.username
    if user.full_name is not None:
        db_user.full_name = user.full_name
    if user.avatar_url is not None:
        db_user.avatar_url = user.avatar_url
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

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

# Weekly Assignment CRUD operations
def create_weekly_assignment(db: Session, assignment: schemas.WeeklyAssignmentCreate):
    db_assignment = models.WeeklyAssignment(
        week_start_date=assignment.week_start_date,
        meal_plan_id=assignment.meal_plan_id,
        user_id=assignment.user_id
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def get_weekly_assignment_by_week(db: Session, week_start_date: str, user_id: int):
    return db.query(models.WeeklyAssignment).filter(
        models.WeeklyAssignment.week_start_date == week_start_date,
        models.WeeklyAssignment.user_id == user_id
    ).first()

def get_user_weekly_assignments(db: Session, user_id: int):
    return db.query(models.WeeklyAssignment).filter(
        models.WeeklyAssignment.user_id == user_id
    ).all()

def update_weekly_assignment(db: Session, assignment_id: int, assignment: schemas.WeeklyAssignmentCreate):
    db_assignment = db.query(models.WeeklyAssignment).filter(
        models.WeeklyAssignment.id == assignment_id
    ).first()
    if not db_assignment:
        return None
    
    db_assignment.meal_plan_id = assignment.meal_plan_id
    db_assignment.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def delete_weekly_assignment(db: Session, assignment_id: int):
    db_assignment = db.query(models.WeeklyAssignment).filter(
        models.WeeklyAssignment.id == assignment_id
    ).first()
    if db_assignment:
        db.delete(db_assignment)
        db.commit()
    return db_assignment
