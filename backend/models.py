from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

# Association table for many-to-many relationship between Meal and Food
meal_food_association = Table(
    "meal_food",
    Base.metadata,
    Column("meal_id", Integer, ForeignKey("meals.id")),
    Column("food_id", Integer, ForeignKey("foods.id")),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    meals = relationship("Meal", back_populates="user")
    
class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    
    # Relationships
    meals = relationship("Meal", secondary=meal_food_association, back_populates="foods")
    
class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(DateTime, default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="meals")
    foods = relationship("Food", secondary=meal_food_association, back_populates="meals")
