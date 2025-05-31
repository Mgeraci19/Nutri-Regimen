from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Relationship
    recipes = relationship("Recipe", back_populates="creator")

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

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    
    recipe_id = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)
    amount = Column(Float)
    unit = Column(String)  # e.g., "g", "tbsp", "cup"
    
    # Relationships
    recipe = relationship("Recipe", back_populates="ingredient_associations")
    ingredient = relationship("Ingredient", back_populates="recipe_associations")