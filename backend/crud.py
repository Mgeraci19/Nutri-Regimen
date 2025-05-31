from sqlalchemy.orm import Session
from typing import List
import models
from schemas import UserCreate, IngredientCreate, RecipeCreate

# User CRUD operations
def create_user(db: Session, user: UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
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

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

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