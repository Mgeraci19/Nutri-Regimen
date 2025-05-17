"""
Script to initialize the database with sample data.
Run this script to create the database and populate it with sample data.
"""

import os
from sqlalchemy.orm import Session

# Import local modules
from database import engine, SessionLocal, Base
import models
import crud
from schemas import UserCreate, FoodCreate, MealCreate

# Create database tables
def init_db():
    # Check if database file already exists
    if os.path.exists("./nutri_regimen.db"):
        print("Database already exists. Removing old database...")
        os.remove("./nutri_regimen.db")
        print("Old database removed.")
    
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Create sample users
        print("Creating sample users...")
        user1 = UserCreate(email="john@example.com", username="john_doe", password="password123")
        user2 = UserCreate(email="jane@example.com", username="jane_doe", password="password456")
        
        db_user1 = crud.create_user(db, user1)
        db_user2 = crud.create_user(db, user2)
        print(f"Created users: {db_user1.username}, {db_user2.username}")
        
        # Create sample foods
        print("Creating sample foods...")
        foods = [
            FoodCreate(name="Apple", calories=95.0, protein=0.5, carbs=25.0, fat=0.3),
            FoodCreate(name="Banana", calories=105.0, protein=1.3, carbs=27.0, fat=0.4),
            FoodCreate(name="Chicken Breast", calories=165.0, protein=31.0, carbs=0.0, fat=3.6),
            FoodCreate(name="Brown Rice", calories=215.0, protein=5.0, carbs=45.0, fat=1.8),
            FoodCreate(name="Broccoli", calories=55.0, protein=3.7, carbs=11.0, fat=0.6),
            FoodCreate(name="Salmon", calories=206.0, protein=22.0, carbs=0.0, fat=13.0),
            FoodCreate(name="Sweet Potato", calories=180.0, protein=4.0, carbs=41.0, fat=0.1),
            FoodCreate(name="Egg", calories=78.0, protein=6.3, carbs=0.6, fat=5.3),
            FoodCreate(name="Avocado", calories=240.0, protein=3.0, carbs=12.0, fat=22.0),
            FoodCreate(name="Greek Yogurt", calories=100.0, protein=17.0, carbs=6.0, fat=0.4),
        ]
        
        db_foods = []
        for food in foods:
            db_food = crud.create_food(db, food)
            db_foods.append(db_food)
            print(f"Created food: {db_food.name}")
        
        # Create sample meals
        print("Creating sample meals...")
        
        # Breakfast for user1
        breakfast = MealCreate(
            name="Breakfast",
            user_id=db_user1.id,
            food_ids=[db_foods[1].id, db_foods[7].id, db_foods[9].id]  # Banana, Egg, Greek Yogurt
        )
        db_breakfast = crud.create_meal(db, breakfast)
        print(f"Created meal: {db_breakfast.name} for user {db_user1.username}")
        
        # Lunch for user1
        lunch = MealCreate(
            name="Lunch",
            user_id=db_user1.id,
            food_ids=[db_foods[2].id, db_foods[3].id, db_foods[4].id]  # Chicken Breast, Brown Rice, Broccoli
        )
        db_lunch = crud.create_meal(db, lunch)
        print(f"Created meal: {db_lunch.name} for user {db_user1.username}")
        
        # Dinner for user1
        dinner = MealCreate(
            name="Dinner",
            user_id=db_user1.id,
            food_ids=[db_foods[5].id, db_foods[6].id, db_foods[8].id]  # Salmon, Sweet Potato, Avocado
        )
        db_dinner = crud.create_meal(db, dinner)
        print(f"Created meal: {db_dinner.name} for user {db_user1.username}")
        
        # Breakfast for user2
        breakfast2 = MealCreate(
            name="Breakfast",
            user_id=db_user2.id,
            food_ids=[db_foods[0].id, db_foods[9].id]  # Apple, Greek Yogurt
        )
        db_breakfast2 = crud.create_meal(db, breakfast2)
        print(f"Created meal: {db_breakfast2.name} for user {db_user2.username}")
        
        print("Sample data creation completed successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed!")
