"""
Database initialization script with comprehensive sample data for Nutri-Regimen
This script populates the database with realistic ingredients, recipes, users, and meal plans
"""

import os
import sys
import uuid
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, User, Ingredient, Recipe, RecipeIngredient, MealPlan, MealPlanItem, WeeklyAssignment

# Load environment variables
load_dotenv()

def create_tables():
    """Create all database tables"""
    # Drop all tables first to ensure schema updates are applied
    # Use CASCADE to handle foreign key dependencies
    from sqlalchemy import text
    
    with engine.connect() as conn:
        # Drop all tables with CASCADE to handle dependencies
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()
    
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables recreated successfully")

def init_ingredients(db: Session):
    """Initialize ingredients with comprehensive nutritional data"""
    
    ingredients_data = [
        # Proteins
        {"name": "Chicken Breast", "category": "Protein", "calories_per_100g": 165, "protein_per_100g": 31.0, "carbs_per_100g": 0.0, "fat_per_100g": 3.6, "fiber_per_100g": 0.0, "sugar_per_100g": 0.0, "sodium_per_100g": 74.0},
        {"name": "Salmon Fillet", "category": "Protein", "calories_per_100g": 208, "protein_per_100g": 25.4, "carbs_per_100g": 0.0, "fat_per_100g": 12.4, "fiber_per_100g": 0.0, "sugar_per_100g": 0.0, "sodium_per_100g": 59.0},
        {"name": "Ground Turkey", "category": "Protein", "calories_per_100g": 189, "protein_per_100g": 27.4, "carbs_per_100g": 0.0, "fat_per_100g": 8.3, "fiber_per_100g": 0.0, "sugar_per_100g": 0.0, "sodium_per_100g": 98.0},
        {"name": "Eggs", "category": "Protein", "calories_per_100g": 155, "protein_per_100g": 13.0, "carbs_per_100g": 1.1, "fat_per_100g": 11.0, "fiber_per_100g": 0.0, "sugar_per_100g": 1.1, "sodium_per_100g": 124.0},
        {"name": "Greek Yogurt", "category": "Protein", "calories_per_100g": 97, "protein_per_100g": 10.0, "carbs_per_100g": 3.6, "fat_per_100g": 5.0, "fiber_per_100g": 0.0, "sugar_per_100g": 3.6, "sodium_per_100g": 36.0},
        {"name": "Tofu", "category": "Protein", "calories_per_100g": 76, "protein_per_100g": 8.0, "carbs_per_100g": 1.9, "fat_per_100g": 4.8, "fiber_per_100g": 0.3, "sugar_per_100g": 0.6, "sodium_per_100g": 7.0},
        {"name": "Black Beans", "category": "Protein", "calories_per_100g": 132, "protein_per_100g": 8.9, "carbs_per_100g": 23.0, "fat_per_100g": 0.5, "fiber_per_100g": 8.7, "sugar_per_100g": 0.3, "sodium_per_100g": 2.0},
        {"name": "Lentils", "category": "Protein", "calories_per_100g": 116, "protein_per_100g": 9.0, "carbs_per_100g": 20.0, "fat_per_100g": 0.4, "fiber_per_100g": 7.9, "sugar_per_100g": 1.8, "sodium_per_100g": 2.0},
        {"name": "Quinoa", "category": "Protein", "calories_per_100g": 120, "protein_per_100g": 4.4, "carbs_per_100g": 22.0, "fat_per_100g": 1.9, "fiber_per_100g": 2.8, "sugar_per_100g": 0.9, "sodium_per_100g": 5.0},
        
        # Vegetables
        {"name": "Broccoli", "category": "Vegetable", "calories_per_100g": 34, "protein_per_100g": 2.8, "carbs_per_100g": 7.0, "fat_per_100g": 0.4, "fiber_per_100g": 2.6, "sugar_per_100g": 1.5, "sodium_per_100g": 33.0},
        {"name": "Spinach", "category": "Vegetable", "calories_per_100g": 23, "protein_per_100g": 2.9, "carbs_per_100g": 3.6, "fat_per_100g": 0.4, "fiber_per_100g": 2.2, "sugar_per_100g": 0.4, "sodium_per_100g": 79.0},
        {"name": "Bell Peppers", "category": "Vegetable", "calories_per_100g": 31, "protein_per_100g": 1.0, "carbs_per_100g": 7.0, "fat_per_100g": 0.3, "fiber_per_100g": 2.5, "sugar_per_100g": 4.2, "sodium_per_100g": 4.0},
        {"name": "Carrots", "category": "Vegetable", "calories_per_100g": 41, "protein_per_100g": 0.9, "carbs_per_100g": 10.0, "fat_per_100g": 0.2, "fiber_per_100g": 2.8, "sugar_per_100g": 4.7, "sodium_per_100g": 69.0},
        {"name": "Sweet Potato", "category": "Vegetable", "calories_per_100g": 86, "protein_per_100g": 1.6, "carbs_per_100g": 20.0, "fat_per_100g": 0.1, "fiber_per_100g": 3.0, "sugar_per_100g": 4.2, "sodium_per_100g": 5.0},
        {"name": "Zucchini", "category": "Vegetable", "calories_per_100g": 17, "protein_per_100g": 1.2, "carbs_per_100g": 3.1, "fat_per_100g": 0.3, "fiber_per_100g": 1.0, "sugar_per_100g": 2.5, "sodium_per_100g": 8.0},
        {"name": "Kale", "category": "Vegetable", "calories_per_100g": 49, "protein_per_100g": 4.3, "carbs_per_100g": 9.0, "fat_per_100g": 0.9, "fiber_per_100g": 3.6, "sugar_per_100g": 2.3, "sodium_per_100g": 38.0},
        {"name": "Cauliflower", "category": "Vegetable", "calories_per_100g": 25, "protein_per_100g": 1.9, "carbs_per_100g": 5.0, "fat_per_100g": 0.3, "fiber_per_100g": 2.0, "sugar_per_100g": 1.9, "sodium_per_100g": 30.0},
        {"name": "Asparagus", "category": "Vegetable", "calories_per_100g": 20, "protein_per_100g": 2.2, "carbs_per_100g": 3.9, "fat_per_100g": 0.1, "fiber_per_100g": 2.1, "sugar_per_100g": 1.9, "sodium_per_100g": 2.0},
        {"name": "Brussels Sprouts", "category": "Vegetable", "calories_per_100g": 43, "protein_per_100g": 3.4, "carbs_per_100g": 9.0, "fat_per_100g": 0.3, "fiber_per_100g": 3.8, "sugar_per_100g": 2.2, "sodium_per_100g": 25.0},
        
        # Fruits
        {"name": "Banana", "category": "Fruit", "calories_per_100g": 89, "protein_per_100g": 1.1, "carbs_per_100g": 23.0, "fat_per_100g": 0.3, "fiber_per_100g": 2.6, "sugar_per_100g": 12.0, "sodium_per_100g": 1.0},
        {"name": "Apple", "category": "Fruit", "calories_per_100g": 52, "protein_per_100g": 0.3, "carbs_per_100g": 14.0, "fat_per_100g": 0.2, "fiber_per_100g": 2.4, "sugar_per_100g": 10.0, "sodium_per_100g": 1.0},
        {"name": "Blueberries", "category": "Fruit", "calories_per_100g": 57, "protein_per_100g": 0.7, "carbs_per_100g": 14.0, "fat_per_100g": 0.3, "fiber_per_100g": 2.4, "sugar_per_100g": 10.0, "sodium_per_100g": 1.0},
        {"name": "Strawberries", "category": "Fruit", "calories_per_100g": 32, "protein_per_100g": 0.7, "carbs_per_100g": 8.0, "fat_per_100g": 0.3, "fiber_per_100g": 2.0, "sugar_per_100g": 4.9, "sodium_per_100g": 1.0},
        {"name": "Orange", "category": "Fruit", "calories_per_100g": 47, "protein_per_100g": 0.9, "carbs_per_100g": 12.0, "fat_per_100g": 0.1, "fiber_per_100g": 2.4, "sugar_per_100g": 9.4, "sodium_per_100g": 0.0},
        {"name": "Avocado", "category": "Fruit", "calories_per_100g": 160, "protein_per_100g": 2.0, "carbs_per_100g": 9.0, "fat_per_100g": 15.0, "fiber_per_100g": 7.0, "sugar_per_100g": 0.7, "sodium_per_100g": 7.0},
        
        # Grains & Carbs
        {"name": "Brown Rice", "category": "Grain", "calories_per_100g": 111, "protein_per_100g": 2.6, "carbs_per_100g": 23.0, "fat_per_100g": 0.9, "fiber_per_100g": 1.8, "sugar_per_100g": 0.4, "sodium_per_100g": 5.0},
        {"name": "Oats", "category": "Grain", "calories_per_100g": 389, "protein_per_100g": 16.9, "carbs_per_100g": 66.0, "fat_per_100g": 6.9, "fiber_per_100g": 10.6, "sugar_per_100g": 0.0, "sodium_per_100g": 2.0},
        {"name": "Whole Wheat Bread", "category": "Grain", "calories_per_100g": 247, "protein_per_100g": 13.0, "carbs_per_100g": 41.0, "fat_per_100g": 4.2, "fiber_per_100g": 7.0, "sugar_per_100g": 6.0, "sodium_per_100g": 540.0},
        {"name": "Pasta", "category": "Grain", "calories_per_100g": 131, "protein_per_100g": 5.0, "carbs_per_100g": 25.0, "fat_per_100g": 1.1, "fiber_per_100g": 1.8, "sugar_per_100g": 0.6, "sodium_per_100g": 1.0},
        
        # Dairy & Alternatives
        {"name": "Milk", "category": "Dairy", "calories_per_100g": 42, "protein_per_100g": 3.4, "carbs_per_100g": 5.0, "fat_per_100g": 1.0, "fiber_per_100g": 0.0, "sugar_per_100g": 5.0, "sodium_per_100g": 44.0},
        {"name": "Cheddar Cheese", "category": "Dairy", "calories_per_100g": 403, "protein_per_100g": 25.0, "carbs_per_100g": 1.3, "fat_per_100g": 33.0, "fiber_per_100g": 0.0, "sugar_per_100g": 0.5, "sodium_per_100g": 621.0},
        {"name": "Almond Milk", "category": "Dairy Alternative", "calories_per_100g": 17, "protein_per_100g": 0.6, "carbs_per_100g": 1.5, "fat_per_100g": 1.1, "fiber_per_100g": 0.3, "sugar_per_100g": 0.0, "sodium_per_100g": 63.0},
        
        # Nuts & Seeds
        {"name": "Almonds", "category": "Nuts", "calories_per_100g": 579, "protein_per_100g": 21.0, "carbs_per_100g": 22.0, "fat_per_100g": 50.0, "fiber_per_100g": 12.0, "sugar_per_100g": 4.4, "sodium_per_100g": 1.0},
        {"name": "Walnuts", "category": "Nuts", "calories_per_100g": 654, "protein_per_100g": 15.0, "carbs_per_100g": 14.0, "fat_per_100g": 65.0, "fiber_per_100g": 6.7, "sugar_per_100g": 2.6, "sodium_per_100g": 2.0},
        {"name": "Chia Seeds", "category": "Seeds", "calories_per_100g": 486, "protein_per_100g": 17.0, "carbs_per_100g": 42.0, "fat_per_100g": 31.0, "fiber_per_100g": 34.0, "sugar_per_100g": 0.0, "sodium_per_100g": 16.0},
        
        # Oils & Fats
        {"name": "Olive Oil", "category": "Oil", "calories_per_100g": 884, "protein_per_100g": 0.0, "carbs_per_100g": 0.0, "fat_per_100g": 100.0, "fiber_per_100g": 0.0, "sugar_per_100g": 0.0, "sodium_per_100g": 2.0},
        {"name": "Coconut Oil", "category": "Oil", "calories_per_100g": 862, "protein_per_100g": 0.0, "carbs_per_100g": 0.0, "fat_per_100g": 100.0, "fiber_per_100g": 0.0, "sugar_per_100g": 0.0, "sodium_per_100g": 0.0},
        
        # Herbs & Spices
        {"name": "Garlic", "category": "Herb", "calories_per_100g": 149, "protein_per_100g": 6.4, "carbs_per_100g": 33.0, "fat_per_100g": 0.5, "fiber_per_100g": 2.1, "sugar_per_100g": 1.0, "sodium_per_100g": 17.0},
        {"name": "Ginger", "category": "Spice", "calories_per_100g": 80, "protein_per_100g": 1.8, "carbs_per_100g": 18.0, "fat_per_100g": 0.8, "fiber_per_100g": 2.0, "sugar_per_100g": 1.7, "sodium_per_100g": 13.0},
        {"name": "Basil", "category": "Herb", "calories_per_100g": 22, "protein_per_100g": 3.2, "carbs_per_100g": 2.6, "fat_per_100g": 0.6, "fiber_per_100g": 1.6, "sugar_per_100g": 0.3, "sodium_per_100g": 4.0},
        {"name": "Oregano", "category": "Herb", "calories_per_100g": 265, "protein_per_100g": 9.0, "carbs_per_100g": 69.0, "fat_per_100g": 4.3, "fiber_per_100g": 42.5, "sugar_per_100g": 4.1, "sodium_per_100g": 25.0},
    ]
    
    for ingredient_data in ingredients_data:
        ingredient = Ingredient(**ingredient_data)
        db.add(ingredient)
    
    db.commit()
    print(f"✅ Added {len(ingredients_data)} ingredients to the database")

def init_users(db: Session):
    """Initialize sample users"""
    
    users_data = [
        {
            "supabase_user_id": uuid.UUID("550e8400-e29b-41d4-a716-446655440001"),
            "email": "john.doe@example.com",
            "username": "johndoe",
            "full_name": "John Doe",
            "avatar_url": "https://example.com/avatars/john.jpg"
        },
        {
            "supabase_user_id": uuid.UUID("550e8400-e29b-41d4-a716-446655440002"),
            "email": "jane.smith@example.com",
            "username": "janesmith",
            "full_name": "Jane Smith",
            "avatar_url": "https://example.com/avatars/jane.jpg"
        },
        {
            "supabase_user_id": uuid.UUID("550e8400-e29b-41d4-a716-446655440003"),
            "email": "mike.wilson@example.com",
            "username": "mikewilson",
            "full_name": "Mike Wilson",
            "avatar_url": "https://example.com/avatars/mike.jpg"
        },
        {
            "supabase_user_id": uuid.UUID("550e8400-e29b-41d4-a716-446655440004"),
            "email": "sarah.johnson@example.com",
            "username": "sarahjohnson",
            "full_name": "Sarah Johnson",
            "avatar_url": "https://example.com/avatars/sarah.jpg"
        }
    ]
    
    for user_data in users_data:
        user = User(**user_data)
        db.add(user)
    
    db.commit()
    print(f"✅ Added {len(users_data)} users to the database")

def init_public_recipes(db: Session):
    """Initialize public recipes available to all users"""
    
    users = db.query(User).all()
    ingredients = {ing.name: ing for ing in db.query(Ingredient).all()}
    
    recipes_data = [
        {
            "name": "Grilled Chicken with Quinoa Bowl",
            "description": "A healthy, protein-packed bowl with grilled chicken breast, fluffy quinoa, and roasted vegetables",
            "instructions": """1. Season chicken breast with salt, pepper, and herbs
2. Grill chicken for 6-7 minutes per side until cooked through
3. Cook quinoa according to package directions
4. Roast broccoli and bell peppers at 400°F for 20 minutes
5. Slice chicken and serve over quinoa with vegetables
6. Drizzle with olive oil and lemon juice""",
            "is_public": "true",
            "ingredients": [
                ("Chicken Breast", 150, "g"),
                ("Quinoa", 80, "g"),
                ("Broccoli", 100, "g"),
                ("Bell Peppers", 80, "g"),
                ("Olive Oil", 10, "ml"),
            ]
        },
        {
            "name": "Salmon and Sweet Potato Power Bowl",
            "description": "Omega-3 rich salmon with roasted sweet potato and leafy greens",
            "instructions": """1. Preheat oven to 425°F
2. Cut sweet potato into cubes and roast for 25 minutes
3. Season salmon with herbs and bake for 12-15 minutes
4. Massage kale with olive oil and lemon
5. Combine all ingredients in a bowl
6. Top with avocado slices""",
            "user_id": users[1].id,
            "ingredients": [
                ("Salmon Fillet", 120, "g"),
                ("Sweet Potato", 150, "g"),
                ("Kale", 60, "g"),
                ("Avocado", 50, "g"),
                ("Olive Oil", 8, "ml"),
            ]
        },
        {
            "name": "Mediterranean Chickpea Salad",
            "description": "Fresh and vibrant salad with chickpeas, vegetables, and Mediterranean flavors",
            "instructions": """1. Drain and rinse chickpeas
2. Dice cucumber, tomatoes, and bell peppers
3. Crumble feta cheese
4. Mix olive oil, lemon juice, oregano for dressing
5. Combine all ingredients and toss with dressing
6. Let marinate for 30 minutes before serving""",
            "user_id": users[0].id,
            "ingredients": [
                ("Black Beans", 100, "g"),  # Using black beans as chickpea substitute
                ("Bell Peppers", 80, "g"),
                ("Olive Oil", 15, "ml"),
                ("Oregano", 2, "g"),
            ]
        },
        {
            "name": "Turkey and Vegetable Stir-Fry",
            "description": "Quick and healthy stir-fry with lean ground turkey and colorful vegetables",
            "instructions": """1. Heat oil in a large pan or wok
2. Cook ground turkey until browned
3. Add garlic and ginger, cook for 1 minute
4. Add vegetables and stir-fry for 5-7 minutes
5. Season with soy sauce and herbs
6. Serve over brown rice""",
            "user_id": users[2].id,
            "ingredients": [
                ("Ground Turkey", 120, "g"),
                ("Broccoli", 80, "g"),
                ("Carrots", 60, "g"),
                ("Garlic", 5, "g"),
                ("Ginger", 3, "g"),
                ("Brown Rice", 80, "g"),
                ("Olive Oil", 10, "ml"),
            ]
        },
        {
            "name": "Greek Yogurt Berry Parfait",
            "description": "Protein-rich breakfast parfait with Greek yogurt, berries, and nuts",
            "instructions": """1. Layer Greek yogurt in a glass or bowl
2. Add a layer of mixed berries
3. Sprinkle with chopped almonds
4. Repeat layers
5. Top with a drizzle of honey if desired
6. Serve immediately""",
            "user_id": users[3].id,
            "ingredients": [
                ("Greek Yogurt", 150, "g"),
                ("Blueberries", 50, "g"),
                ("Strawberries", 50, "g"),
                ("Almonds", 20, "g"),
            ]
        },
        {
            "name": "Vegetarian Lentil Curry",
            "description": "Hearty and flavorful lentil curry packed with vegetables and spices",
            "instructions": """1. Sauté onions, garlic, and ginger in oil
2. Add curry spices and cook for 1 minute
3. Add lentils, vegetables, and coconut milk
4. Simmer for 20-25 minutes until lentils are tender
5. Season with salt and pepper
6. Serve with brown rice""",
            "user_id": users[1].id,
            "ingredients": [
                ("Lentils", 100, "g"),
                ("Spinach", 80, "g"),
                ("Carrots", 60, "g"),
                ("Garlic", 8, "g"),
                ("Ginger", 5, "g"),
                ("Coconut Oil", 10, "ml"),
            ]
        },
        {
            "name": "Tofu Buddha Bowl",
            "description": "Nutritious plant-based bowl with marinated tofu and fresh vegetables",
            "instructions": """1. Press tofu and cut into cubes
2. Marinate tofu in soy sauce and spices
3. Pan-fry tofu until golden
4. Prepare quinoa and roast vegetables
5. Arrange all components in a bowl
6. Drizzle with tahini dressing""",
            "user_id": users[2].id,
            "ingredients": [
                ("Tofu", 120, "g"),
                ("Quinoa", 70, "g"),
                ("Kale", 60, "g"),
                ("Carrots", 50, "g"),
                ("Avocado", 60, "g"),
                ("Olive Oil", 12, "ml"),
            ]
        },
        {
            "name": "Overnight Oats with Berries",
            "description": "Make-ahead breakfast with oats, milk, and fresh berries",
            "instructions": """1. Mix oats with milk in a jar
2. Add chia seeds and vanilla
3. Refrigerate overnight
4. In the morning, top with berries
5. Add nuts for extra crunch
6. Enjoy cold or warm""",
            "user_id": users[3].id,
            "ingredients": [
                ("Oats", 50, "g"),
                ("Almond Milk", 150, "ml"),
                ("Chia Seeds", 10, "g"),
                ("Blueberries", 40, "g"),
                ("Strawberries", 40, "g"),
                ("Walnuts", 15, "g"),
            ]
        },
        {
            "name": "Egg and Vegetable Scramble",
            "description": "Protein-rich breakfast scramble with eggs and colorful vegetables",
            "instructions": """1. Heat oil in a non-stick pan
2. Sauté vegetables until tender
3. Beat eggs and pour into pan
4. Scramble eggs with vegetables
5. Season with herbs and spices
6. Serve with whole grain toast""",
            "user_id": users[0].id,
            "ingredients": [
                ("Eggs", 120, "g"),  # About 2 large eggs
                ("Spinach", 50, "g"),
                ("Bell Peppers", 60, "g"),
                ("Olive Oil", 8, "ml"),
                ("Whole Wheat Bread", 30, "g"),
            ]
        },
        {
            "name": "Asian-Style Lettuce Wraps",
            "description": "Light and flavorful lettuce wraps with seasoned protein and vegetables",
            "instructions": """1. Cook ground turkey with garlic and ginger
2. Add vegetables and stir-fry briefly
3. Season with Asian-inspired spices
4. Wash and separate lettuce leaves
5. Fill lettuce cups with mixture
6. Garnish with herbs and serve""",
            "user_id": users[1].id,
            "ingredients": [
                ("Ground Turkey", 100, "g"),
                ("Garlic", 6, "g"),
                ("Ginger", 4, "g"),
                ("Carrots", 40, "g"),
                ("Bell Peppers", 50, "g"),
                ("Olive Oil", 8, "ml"),
            ]
        }
    ]
    
    for recipe_data in recipes_data:
        # Create recipe (public recipes available to all users)
        recipe = Recipe(
            name=recipe_data["name"],
            description=recipe_data["description"],
            instructions=recipe_data["instructions"],
            user_id=recipe_data.get("user_id"),  # Can be None for public recipes
            is_public=recipe_data.get("is_public", "true")  # Default to public
        )
        db.add(recipe)
        db.flush()  # Get the recipe ID
        
        # Add recipe ingredients
        for ingredient_name, quantity, unit in recipe_data["ingredients"]:
            if ingredient_name in ingredients:
                recipe_ingredient = RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ingredients[ingredient_name].id,
                    quantity=quantity,
                    unit=unit
                )
                db.add(recipe_ingredient)
    
    db.commit()
    print(f"✅ Added {len(recipes_data)} recipes with ingredients to the database")

def init_meal_plans(db: Session):
    """Initialize sample meal plans"""
    
    users = db.query(User).all()
    recipes = db.query(Recipe).all()
    
    meal_plans_data = [
        {
            "name": "Healthy Weight Loss Plan",
            "user_id": users[0].id,
            "meals": [
                # Monday
                {"day": "Monday", "meal_type": "breakfast", "recipe": "Greek Yogurt Berry Parfait"},
                {"day": "Monday", "meal_type": "lunch", "recipe": "Mediterranean Chickpea Salad"},
                {"day": "Monday", "meal_type": "dinner", "recipe": "Grilled Chicken with Quinoa Bowl"},
                # Tuesday
                {"day": "Tuesday", "meal_type": "breakfast", "recipe": "Overnight Oats with Berries"},
                {"day": "Tuesday", "meal_type": "lunch", "recipe": "Asian-Style Lettuce Wraps"},
                {"day": "Tuesday", "meal_type": "dinner", "recipe": "Salmon and Sweet Potato Power Bowl"},
                # Wednesday
                {"day": "Wednesday", "meal_type": "breakfast", "recipe": "Egg and Vegetable Scramble"},
                {"day": "Wednesday", "meal_type": "lunch", "recipe": "Tofu Buddha Bowl"},
                {"day": "Wednesday", "meal_type": "dinner", "recipe": "Turkey and Vegetable Stir-Fry"},
            ]
        },
        {
            "name": "High Protein Muscle Building",
            "user_id": users[1].id,
            "meals": [
                # Monday
                {"day": "Monday", "meal_type": "breakfast", "recipe": "Egg and Vegetable Scramble"},
                {"day": "Monday", "meal_type": "lunch", "recipe": "Grilled Chicken with Quinoa Bowl"},
                {"day": "Monday", "meal_type": "dinner", "recipe": "Salmon and Sweet Potato Power Bowl"},
                # Tuesday
                {"day": "Tuesday", "meal_type": "breakfast", "recipe": "Greek Yogurt Berry Parfait"},
                {"day": "Tuesday", "meal_type": "lunch", "recipe": "Turkey and Vegetable Stir-Fry"},
                {"day": "Tuesday", "meal_type": "dinner", "recipe": "Tofu Buddha Bowl"},
                # Wednesday
                {"day": "Wednesday", "meal_type": "breakfast", "recipe": "Overnight Oats with Berries"},
                {"day": "Wednesday", "meal_type": "lunch", "recipe": "Asian-Style Lettuce Wraps"},
                {"day": "Wednesday", "meal_type": "dinner", "recipe": "Vegetarian Lentil Curry"},
            ]
        },
        {
            "name": "Plant-Based Nutrition Plan",
            "user_id": users[2].id,
            "meals": [
                # Monday
                {"day": "Monday", "meal_type": "breakfast", "recipe": "Overnight Oats with Berries"},
                {"day": "Monday", "meal_type": "lunch", "recipe": "Tofu Buddha Bowl"},
                {"day": "Monday", "meal_type": "dinner", "recipe": "Vegetarian Lentil Curry"},
                # Tuesday
                {"day": "Tuesday", "meal_type": "breakfast", "recipe": "Greek Yogurt Berry Parfait"},
                {"day": "Tuesday", "meal_type": "lunch", "recipe": "Mediterranean Chickpea Salad"},
                {"day": "Tuesday", "meal_type": "dinner", "recipe": "Tofu Buddha Bowl"},
                # Wednesday
                {"day": "Wednesday", "meal_type": "breakfast", "recipe": "Overnight Oats with Berries"},
                {"day": "Wednesday", "meal_type": "lunch", "recipe": "Vegetarian Lentil Curry"},
                {"day": "Wednesday", "meal_type": "dinner", "recipe": "Mediterranean Chickpea Salad"},
            ]
        },
        {
            "name": "Balanced Family Meals",
            "user_id": users[3].id,
            "meals": [
                # Monday
                {"day": "Monday", "meal_type": "breakfast", "recipe": "Egg and Vegetable Scramble"},
                {"day": "Monday", "meal_type": "lunch", "recipe": "Turkey and Vegetable Stir-Fry"},
                {"day": "Monday", "meal_type": "dinner", "recipe": "Grilled Chicken with Quinoa Bowl"},
                # Tuesday
                {"day": "Tuesday", "meal_type": "breakfast", "recipe": "Greek Yogurt Berry Parfait"},
                {"day": "Tuesday", "meal_type": "lunch", "recipe": "Salmon and Sweet Potato Power Bowl"},
                {"day": "Tuesday", "meal_type": "dinner", "recipe": "Asian-Style Lettuce Wraps"},
                # Wednesday
                {"day": "Wednesday", "meal_type": "breakfast", "recipe": "Overnight Oats with Berries"},
                {"day": "Wednesday", "meal_type": "lunch", "recipe": "Mediterranean Chickpea Salad"},
                {"day": "Wednesday", "meal_type": "dinner", "recipe": "Vegetarian Lentil Curry"},
            ]
        }
    ]
    
    # Create a mapping of recipe names to recipe objects
    recipe_map = {recipe.name: recipe for recipe in recipes}
    
    for meal_plan_data in meal_plans_data:
        # Create meal plan
        meal_plan = MealPlan(
            name=meal_plan_data["name"],
            user_id=meal_plan_data["user_id"]
        )
        db.add(meal_plan)
        db.flush()  # Get the meal plan ID
        
        # Add meal plan items
        for meal_data in meal_plan_data["meals"]:
            recipe_name = meal_data["recipe"]
            if recipe_name in recipe_map:
                meal_plan_item = MealPlanItem(
                    meal_plan_id=meal_plan.id,
                    recipe_id=recipe_map[recipe_name].id,
                    day_of_week=meal_data["day"],
                    meal_type=meal_data["meal_type"]
                )
                db.add(meal_plan_item)
    
    db.commit()
    print(f"✅ Added {len(meal_plans_data)} meal plans with items to the database")

def init_weekly_assignments(db: Session):
    """Initialize weekly assignments for meal plans"""
    
    users = db.query(User).all()
    meal_plans = db.query(MealPlan).all()
    
    # Create weekly assignments for the current week and next few weeks
    today = date.today()
    current_week_start = today - timedelta(days=today.weekday())  # Monday of current week
    
    weekly_assignments_data = []
    
    for i in range(4):  # Create assignments for 4 weeks
        week_start = current_week_start + timedelta(weeks=i)
        
        # Assign meal plans to users for this week
        for j, user in enumerate(users):
            if j < len(meal_plans):
                weekly_assignments_data.append({
                    "week_start_date": week_start,
                    "meal_plan_id": meal_plans[j].id,
                    "user_id": user.id
                })
    
    for assignment_data in weekly_assignments_data:
        assignment = WeeklyAssignment(**assignment_data)
        db.add(assignment)
    
    db.commit()
    print(f"✅ Added {len(weekly_assignments_data)} weekly assignments to the database")

def clear_database(db: Session):
    """Clear all data from the database (for development/testing)"""
    
    # Delete in reverse order of dependencies
    db.query(WeeklyAssignment).delete()
    db.query(MealPlanItem).delete()
    db.query(MealPlan).delete()
    db.query(RecipeIngredient).delete()
    db.query(Recipe).delete()
    db.query(Ingredient).delete()
    db.query(User).delete()
    
    db.commit()
    print("🗑️ Database cleared successfully")

def main():
    """Main function to initialize the database with sample data"""
    
    print("🚀 Starting database initialization...")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create tables
        create_tables()
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        clear_database(db)
        
        # Initialize data in order of dependencies
        init_ingredients(db)
        init_users(db)
        init_public_recipes(db)
        init_meal_plans(db)
        init_weekly_assignments(db)
        
        print("\n🎉 Database initialization completed successfully!")
        print("\nSummary of data added:")
        print(f"- {db.query(Ingredient).count()} ingredients")
        print(f"- {db.query(User).count()} users")
        print(f"- {db.query(Recipe).count()} recipes")
        print(f"- {db.query(RecipeIngredient).count()} recipe-ingredient associations")
        print(f"- {db.query(MealPlan).count()} meal plans")
        print(f"- {db.query(MealPlanItem).count()} meal plan items")
        print(f"- {db.query(WeeklyAssignment).count()} weekly assignments")
        
    except Exception as e:
        print(f"❌ Error during database initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
