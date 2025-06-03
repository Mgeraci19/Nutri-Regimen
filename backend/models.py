from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Relationships
    recipes = relationship("Recipe", back_populates="creator")
    meal_plans = relationship("MealPlan", back_populates="user")

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    
    # Relationship
    recipe_associations = relationship("RecipeIngredient", back_populates="ingredient")

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    instructions = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    creator = relationship("User", back_populates="recipes")
    ingredient_associations = relationship("RecipeIngredient", back_populates="recipe")
    meal_plan_items = relationship("MealPlanItem", back_populates="recipe")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    
    recipe_id = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)
    amount = Column(Float)
    unit = Column(String)
    
    # Relationships
    recipe = relationship("Recipe", back_populates="ingredient_associations")
    ingredient = relationship("Ingredient", back_populates="recipe_associations")

class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="meal_plans")
    meal_plan_items = relationship("MealPlanItem", back_populates="meal_plan", cascade="all, delete-orphan")

class MealPlanItem(Base):
    __tablename__ = "meal_plan_items"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    day_of_week = Column(String)  # Monday, Tuesday, etc.
    meal_type = Column(String)    # breakfast, lunch, dinner
    
    # Relationships
    meal_plan = relationship("MealPlan", back_populates="meal_plan_items")
    recipe = relationship("Recipe", back_populates="meal_plan_items")