from typing import List, Optional, Union
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware


import models, schemas, crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nutri-Regimen API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174" , "http://localhost:3000" ],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Nutri-Regimen API"}

# User endpoints
@app.post("/users/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.UserWithMeals)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.delete_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Ingredient endpoints
@app.post("/ingredients/", response_model=schemas.Ingredient, status_code=status.HTTP_201_CREATED)
def create_ingredient(ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)):
    return crud.create_ingredient(db=db, ingredient=ingredient)

@app.get("/ingredients/", response_model=List[schemas.Ingredient])
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ingredients = crud.get_ingredients(db, skip=skip, limit=limit)
    return ingredients

@app.get("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def read_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    db_ingredient = crud.get_ingredient(db, ingredient_id=ingredient_id)
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ingredient

# Recipe endpoints
@app.post("/recipes/", response_model=schemas.Recipe, status_code=status.HTTP_201_CREATED)
def create_recipe(recipe: schemas.RecipeCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_recipe(db=db, recipe=recipe, user_id=user_id)

@app.get("/recipes/", response_model=List[schemas.Recipe])
def read_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    return recipes

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

# Meal Plan endpoints
@app.post("/meal-plans/", response_model=schemas.MealPlan, status_code=status.HTTP_201_CREATED)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_meal_plan(db=db, meal_plan=meal_plan, user_id=user_id)

@app.get("/meal-plans/", response_model=List[schemas.MealPlan])
def read_meal_plans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meal_plans = crud.get_meal_plans(db, skip=skip, limit=limit)
    return meal_plans

@app.get("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def read_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    db_meal_plan = crud.get_meal_plan(db, meal_plan_id=meal_plan_id)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan

@app.get("/users/{user_id}/meal-plans/", response_model=List[schemas.MealPlan])
def read_user_meal_plans(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    meal_plans = crud.get_user_meal_plans(db, user_id=user_id, skip=skip, limit=limit)
    return meal_plans

@app.put("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def update_meal_plan(meal_plan_id: int, meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    db_meal_plan = crud.update_meal_plan(db, meal_plan_id=meal_plan_id, meal_plan=meal_plan)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan

@app.delete("/meal-plans/{meal_plan_id}", response_model=schemas.MealPlan)
def delete_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    db_meal_plan = crud.delete_meal_plan(db, meal_plan_id=meal_plan_id)
    if db_meal_plan is None:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    return db_meal_plan