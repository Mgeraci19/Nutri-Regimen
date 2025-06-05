from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    supabase_user_id = Column(String, unique=True, index=True, nullable=False)  # Links to Supabase auth.users
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)  # Optional, can be set later
    full_name = Column(String, nullable=True)  # From Supabase user metadata
    avatar_url = Column(String, nullable=True)  # From Supabase user metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    recipes = relationship("Recipe", back_populates="creator")
    meal_plans = relationship("MealPlan", back_populates="user")

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    calories_per_100g = Column(Integer)
    protein_per_100g = Column(Float)
    carbs_per_100g = Column(Float)
    fat_per_100g = Column(Float)
    fiber_per_100g = Column(Float)
    sugar_per_100g = Column(Float)
    sodium_per_100g = Column(Float)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
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
    quantity = Column(Float)  # Using existing 'quantity' column instead of 'amount'
    unit = Column(String)
    
    # Relationships
    recipe = relationship("Recipe", back_populates="ingredient_associations")
    ingredient = relationship("Ingredient", back_populates="recipe_associations")

class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
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

class WeeklyAssignment(Base):
    __tablename__ = "weekly_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    week_start_date = Column(String, index=True)  # ISO date string (Monday of that week)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    meal_plan = relationship("MealPlan")
