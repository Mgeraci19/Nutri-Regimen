from typing import List, Optional, Union
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models, schemas, crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nutri-Regimen API")

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

# Food endpoints
@app.post("/foods/", response_model=schemas.Food, status_code=status.HTTP_201_CREATED)
def create_food(food: schemas.FoodCreate, db: Session = Depends(get_db)):
    return crud.create_food(db=db, food=food)

@app.get("/foods/", response_model=List[schemas.Food])
def read_foods(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    foods = crud.get_foods(db, skip=skip, limit=limit)
    return foods

@app.get("/foods/{food_id}", response_model=schemas.Food)
def read_food(food_id: int, db: Session = Depends(get_db)):
    db_food = crud.get_food(db, food_id=food_id)
    if db_food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return db_food

@app.put("/foods/{food_id}", response_model=schemas.Food)
def update_food(food_id: int, food: schemas.FoodUpdate, db: Session = Depends(get_db)):
    db_food = crud.update_food(db, food_id=food_id, food=food)
    if db_food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return db_food

@app.delete("/foods/{food_id}", response_model=schemas.Food)
def delete_food(food_id: int, db: Session = Depends(get_db)):
    db_food = crud.delete_food(db, food_id=food_id)
    if db_food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return db_food

# Meal endpoints
@app.post("/meals/", response_model=schemas.Meal, status_code=status.HTTP_201_CREATED)
def create_meal(meal: schemas.MealCreate, db: Session = Depends(get_db)):
    return crud.create_meal(db=db, meal=meal)

@app.get("/meals/", response_model=List[schemas.Meal])
def read_meals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meals = crud.get_meals(db, skip=skip, limit=limit)
    return meals

@app.get("/meals/{meal_id}", response_model=schemas.Meal)
def read_meal(meal_id: int, db: Session = Depends(get_db)):
    db_meal = crud.get_meal(db, meal_id=meal_id)
    if db_meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return db_meal

@app.get("/users/{user_id}/meals/", response_model=List[schemas.Meal])
def read_user_meals(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    meals = crud.get_user_meals(db, user_id=user_id, skip=skip, limit=limit)
    return meals

@app.put("/meals/{meal_id}", response_model=schemas.Meal)
def update_meal(meal_id: int, meal: schemas.MealUpdate, db: Session = Depends(get_db)):
    db_meal = crud.update_meal(db, meal_id=meal_id, meal=meal)
    if db_meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return db_meal

@app.delete("/meals/{meal_id}", response_model=schemas.Meal)
def delete_meal(meal_id: int, db: Session = Depends(get_db)):
    db_meal = crud.delete_meal(db, meal_id=meal_id)
    if db_meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return db_meal
