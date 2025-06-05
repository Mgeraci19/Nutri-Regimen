from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import models, schemas, crud
from database import engine, get_db
from auth import get_current_user, get_current_user_optional

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nutri-Regimen API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Nutri-Regimen API with Supabase Authentication"}

# Authentication endpoints
@app.get("/auth/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user

# User endpoints
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@app.put("/users/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    updated_user = crud.update_user(db=db, user_id=current_user.id, user=user_update)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.get("/users/", response_model=List[schemas.User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all users (authenticated users only)"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.UserWithMealPlans)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get user by ID"""
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Ingredient endpoints
@app.post("/ingredients/", response_model=schemas.Ingredient, status_code=status.HTTP_201_CREATED)
def create_ingredient(
    ingredient: schemas.IngredientCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new ingredient"""
    return crud.create_ingredient(db=db, ingredient=ingredient)

@app.get("/ingredients/", response_model=List[schemas.Ingredient])
def read_ingredients(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get all ingredients (public endpoint)"""
    ingredients = crud.get_ingredients(db, skip=skip, limit=limit)
    return ingredients

@app.get("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def read_ingredient(
    ingredient_id: int, 
    db: Session = Depends(get_db)
):
    """Get ingredient by ID (public endpoint)"""
    db_ingredient = crud.get_ingredient(db, ingredient_id=ingredient_id)
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ingredient

# Recipe endpoints
@app.post("/recipes/", response_model=schemas.Recipe, status_code=status.HTTP_201_CREATED)
def create_recipe(
    recipe: schemas.RecipeCreate, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new recipe"""
    return crud.create_recipe(db=db, recipe=recipe, user_id=current_user.id)

@app.get("/recipes/", response_model=List[schemas.Recipe])
def read_recipes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Get all recipes (public endpoint)"""
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    return recipes

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(
    recipe_id: int, 
    db: Session = Depends(get_db)
):
    """Get recipe by ID (public endpoint)"""
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

# Meal Plan endpoints
@app.post("/meal-plans/", response_model=schemas.MealPlan, status_code=status.HTTP_201_CREATED)
def create_meal_plan(
    meal_plan: schemas.MealPlanCreate, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new meal plan"""
    return crud.create_meal_plan(db=db, meal_plan=meal_plan, user_id=current_user.id)

@app.get("/meal-plans/", response_model=List[schemas.MealPlan])
def read_meal_plans(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all meal plans (authenticated users only)"""
    meal_plans = crud.get_meal_plans(db, skip=skip, limit=limit)
    return meal_plans

@app.get("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def read_meal_plan(
    meal_plan_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get meal plan by ID"""
    db_meal_plan = crud.get_meal_plan(db, meal_plan_id=meal_plan_id)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan

@app.get("/users/me/meal-plans/", response_model=List[schemas.MealPlan])
def read_current_user_meal_plans(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's meal plans"""
    meal_plans = crud.get_user_meal_plans(db, user_id=current_user.id, skip=skip, limit=limit)
    return meal_plans

@app.get("/users/{user_id}/meal-plans/", response_model=List[schemas.MealPlan])
def read_user_meal_plans(
    user_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get user's meal plans by user ID"""
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    meal_plans = crud.get_user_meal_plans(db, user_id=user_id, skip=skip, limit=limit)
    return meal_plans

@app.put("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def update_meal_plan(
    meal_plan_id: int, 
    meal_plan: schemas.MealPlanCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update a meal plan"""
    # Check if the meal plan belongs to the current user
    existing_meal_plan = crud.get_meal_plan(db, meal_plan_id=meal_plan_id)
    if existing_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    if existing_meal_plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this meal plan")
    
    db_meal_plan = crud.update_meal_plan(db, meal_plan_id=meal_plan_id, meal_plan=meal_plan)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan

@app.delete("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def delete_meal_plan(
    meal_plan_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete a meal plan"""
    # Check if the meal plan belongs to the current user
    existing_meal_plan = crud.get_meal_plan(db, meal_plan_id=meal_plan_id)
    if existing_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    if existing_meal_plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this meal plan")
    
    db_meal_plan = crud.delete_meal_plan(db, meal_plan_id=meal_plan_id)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan

# Weekly Assignment endpoints
@app.post("/weekly-assignments/", response_model=schemas.WeeklyAssignment, status_code=status.HTTP_201_CREATED)
def create_weekly_assignment(
    assignment: schemas.WeeklyAssignmentCreate, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update a weekly assignment"""
    # Ensure the assignment is for the current user
    assignment.user_id = current_user.id
    
    # Check if assignment already exists for this week and user
    existing = crud.get_weekly_assignment_by_week(db, assignment.week_start_date, current_user.id)
    if existing:
        # Update existing assignment
        return crud.update_weekly_assignment(db, existing.id, assignment)
    return crud.create_weekly_assignment(db=db, assignment=assignment)

@app.get("/users/me/weekly-assignments/", response_model=List[schemas.WeeklyAssignment])
def read_current_user_weekly_assignments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's weekly assignments"""
    return crud.get_user_weekly_assignments(db, user_id=current_user.id)

@app.get("/users/{user_id}/weekly-assignments/", response_model=List[schemas.WeeklyAssignment])
def read_user_weekly_assignments(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get user's weekly assignments by user ID"""
    return crud.get_user_weekly_assignments(db, user_id=user_id)

@app.delete("/weekly-assignments/{assignment_id}", response_model=schemas.WeeklyAssignment)
def delete_weekly_assignment(
    assignment_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete a weekly assignment"""
    # Check if the assignment belongs to the current user
    assignment = crud.get_user_weekly_assignments(db, current_user.id)
    assignment_exists = any(a.id == assignment_id for a in assignment)
    if not assignment_exists:
        raise HTTPException(status_code=404, detail="Weekly assignment not found or not authorized")
    
    db_assignment = crud.delete_weekly_assignment(db, assignment_id=assignment_id)
    if db_assignment is None:
        raise HTTPException(status_code=404, detail="Weekly assignment not found")
    return db_assignment
