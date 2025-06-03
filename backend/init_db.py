"""
Script to initialize the database with sample data.
Run this script to create the database and populate it with sample data.
"""

import os
# Import local modules
from database import engine, SessionLocal, Base
import models
import crud
from schemas import UserCreate, IngredientCreate, RecipeCreate, RecipeIngredientCreate, MealPlanCreate, MealPlanItemCreate

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
        users_data = [
            UserCreate(email="john@example.com", username="john_doe", password="password123"),
            UserCreate(email="jane@example.com", username="jane_doe", password="password456"),
            UserCreate(email="chef@example.com", username="chef_master", password="password789"),
            UserCreate(email="nutritionist@example.com", username="nutrition_pro", password="password101"),
            UserCreate(email="fitness@example.com", username="fitness_guru", password="password102"),
        ]
        
        db_users = []
        for user in users_data:
            db_user = crud.create_user(db, user)
            db_users.append(db_user)
            print(f"Created user: {db_user.username}")
        
        # Create sample ingredients
        print("Creating sample ingredients...")
        ingredients_data = [
            # Proteins
            IngredientCreate(name="Chicken Breast", calories=165, protein=31.0, carbs=0.0, fat=3.6),
            IngredientCreate(name="Salmon", calories=206, protein=22.0, carbs=0.0, fat=13.0),
            IngredientCreate(name="Ground Turkey", calories=167, protein=20.0, carbs=0.0, fat=9.0),
            IngredientCreate(name="Tofu", calories=70, protein=8.0, carbs=2.0, fat=4.0),
            IngredientCreate(name="Eggs", calories=155, protein=13.0, carbs=1.0, fat=11.0),
            IngredientCreate(name="Greek Yogurt", calories=100, protein=17.0, carbs=6.0, fat=0.4),
            IngredientCreate(name="Cottage Cheese", calories=98, protein=11.0, carbs=3.0, fat=4.0),
            IngredientCreate(name="Lean Beef", calories=182, protein=26.0, carbs=0.0, fat=8.0),
            IngredientCreate(name="Tuna", calories=132, protein=28.0, carbs=0.0, fat=1.0),
            IngredientCreate(name="Black Beans", calories=132, protein=9.0, carbs=23.0, fat=0.5),
            
            # Carbohydrates
            IngredientCreate(name="Brown Rice", calories=215, protein=5.0, carbs=45.0, fat=1.8),
            IngredientCreate(name="Quinoa", calories=222, protein=8.0, carbs=39.0, fat=3.6),
            IngredientCreate(name="Sweet Potato", calories=180, protein=4.0, carbs=41.0, fat=0.1),
            IngredientCreate(name="Oats", calories=389, protein=17.0, carbs=66.0, fat=7.0),
            IngredientCreate(name="Whole Wheat Pasta", calories=174, protein=7.0, carbs=35.0, fat=1.1),
            IngredientCreate(name="White Rice", calories=205, protein=4.0, carbs=45.0, fat=0.4),
            IngredientCreate(name="Banana", calories=105, protein=1.3, carbs=27.0, fat=0.4),
            IngredientCreate(name="Apple", calories=95, protein=0.5, carbs=25.0, fat=0.3),
            IngredientCreate(name="Bread", calories=265, protein=9.0, carbs=49.0, fat=3.2),
            IngredientCreate(name="Potato", calories=161, protein=4.0, carbs=37.0, fat=0.2),
            
            # Vegetables
            IngredientCreate(name="Broccoli", calories=55, protein=3.7, carbs=11.0, fat=0.6),
            IngredientCreate(name="Spinach", calories=23, protein=2.9, carbs=3.6, fat=0.4),
            IngredientCreate(name="Bell Pepper", calories=31, protein=1.0, carbs=7.0, fat=0.3),
            IngredientCreate(name="Carrots", calories=41, protein=0.9, carbs=10.0, fat=0.2),
            IngredientCreate(name="Onion", calories=40, protein=1.1, carbs=9.0, fat=0.1),
            IngredientCreate(name="Tomato", calories=18, protein=0.9, carbs=3.9, fat=0.2),
            IngredientCreate(name="Cucumber", calories=16, protein=0.7, carbs=4.0, fat=0.1),
            IngredientCreate(name="Lettuce", calories=15, protein=1.4, carbs=2.9, fat=0.2),
            IngredientCreate(name="Mushrooms", calories=22, protein=3.1, carbs=3.3, fat=0.3),
            IngredientCreate(name="Zucchini", calories=20, protein=2.0, carbs=3.9, fat=0.3),
            
            # Fats
            IngredientCreate(name="Avocado", calories=240, protein=3.0, carbs=12.0, fat=22.0),
            IngredientCreate(name="Olive Oil", calories=884, protein=0.0, carbs=0.0, fat=100.0),
            IngredientCreate(name="Almonds", calories=576, protein=21.0, carbs=22.0, fat=49.0),
            IngredientCreate(name="Peanut Butter", calories=588, protein=25.0, carbs=20.0, fat=50.0),
            IngredientCreate(name="Coconut Oil", calories=862, protein=0.0, carbs=0.0, fat=99.0),
            IngredientCreate(name="Walnuts", calories=654, protein=15.0, carbs=14.0, fat=65.0),
            IngredientCreate(name="Chia Seeds", calories=486, protein=17.0, carbs=42.0, fat=31.0),
            IngredientCreate(name="Flaxseeds", calories=534, protein=18.0, carbs=29.0, fat=42.0),
            
            # Dairy & Others
            IngredientCreate(name="Milk", calories=42, protein=3.4, carbs=5.0, fat=1.0),
            IngredientCreate(name="Cheese", calories=402, protein=25.0, carbs=1.3, fat=33.0),
            IngredientCreate(name="Butter", calories=717, protein=0.9, carbs=0.1, fat=81.0),
            IngredientCreate(name="Honey", calories=304, protein=0.3, carbs=82.0, fat=0.0),
            IngredientCreate(name="Coconut", calories=354, protein=3.3, carbs=15.0, fat=33.0),
            IngredientCreate(name="Dark Chocolate", calories=546, protein=8.0, carbs=61.0, fat=31.0),
        ]
        
        db_ingredients = []
        for ingredient in ingredients_data:
            db_ingredient = crud.create_ingredient(db, ingredient)
            db_ingredients.append(db_ingredient)
            print(f"Created ingredient: {db_ingredient.name}")
        
        # Create sample recipes
        print("Creating sample recipes...")
        recipes_data = [
            # Breakfast recipes
            RecipeCreate(
                name="Protein Pancakes",
                description="High-protein breakfast pancakes",
                instructions="1. Mix oats, eggs, and banana. 2. Cook on griddle. 3. Serve with Greek yogurt.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=13, amount=50, unit="g"),  # Oats
                    RecipeIngredientCreate(ingredient_id=5, amount=2, unit="whole"),  # Eggs
                    RecipeIngredientCreate(ingredient_id=17, amount=1, unit="whole"),  # Banana
                    RecipeIngredientCreate(ingredient_id=6, amount=100, unit="g"),  # Greek Yogurt
                ]
            ),
            RecipeCreate(
                name="Avocado Toast",
                description="Simple and nutritious breakfast",
                instructions="1. Toast bread. 2. Mash avocado. 3. Spread on toast. 4. Season with salt and pepper.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=19, amount=2, unit="slices"),  # Bread
                    RecipeIngredientCreate(ingredient_id=31, amount=1, unit="whole"),  # Avocado
                    RecipeIngredientCreate(ingredient_id=32, amount=5, unit="ml"),  # Olive Oil
                ]
            ),
            
            # Lunch recipes
            RecipeCreate(
                name="Chicken and Rice Bowl",
                description="Balanced protein and carb meal",
                instructions="1. Cook chicken breast. 2. Prepare brown rice. 3. Steam broccoli. 4. Combine in bowl.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=1, amount=150, unit="g"),  # Chicken Breast
                    RecipeIngredientCreate(ingredient_id=11, amount=80, unit="g"),  # Brown Rice
                    RecipeIngredientCreate(ingredient_id=21, amount=100, unit="g"),  # Broccoli
                    RecipeIngredientCreate(ingredient_id=32, amount=10, unit="ml"),  # Olive Oil
                ]
            ),
            RecipeCreate(
                name="Quinoa Salad",
                description="Fresh and healthy salad",
                instructions="1. Cook quinoa. 2. Chop vegetables. 3. Mix with olive oil dressing. 4. Add cheese.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=12, amount=100, unit="g"),  # Quinoa
                    RecipeIngredientCreate(ingredient_id=22, amount=50, unit="g"),  # Spinach
                    RecipeIngredientCreate(ingredient_id=26, amount=1, unit="whole"),  # Tomato
                    RecipeIngredientCreate(ingredient_id=40, amount=30, unit="g"),  # Cheese
                    RecipeIngredientCreate(ingredient_id=32, amount=15, unit="ml"),  # Olive Oil
                ]
            ),
            
            # Dinner recipes
            RecipeCreate(
                name="Salmon with Sweet Potato",
                description="Omega-3 rich dinner",
                instructions="1. Bake salmon. 2. Roast sweet potato. 3. Sauté spinach. 4. Serve together.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=2, amount=150, unit="g"),  # Salmon
                    RecipeIngredientCreate(ingredient_id=13, amount=200, unit="g"),  # Sweet Potato
                    RecipeIngredientCreate(ingredient_id=22, amount=100, unit="g"),  # Spinach
                    RecipeIngredientCreate(ingredient_id=32, amount=10, unit="ml"),  # Olive Oil
                ]
            ),
            RecipeCreate(
                name="Turkey Meatballs",
                description="Lean protein dinner",
                instructions="1. Mix turkey with vegetables. 2. Form meatballs. 3. Bake. 4. Serve with pasta.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=3, amount=200, unit="g"),  # Ground Turkey
                    RecipeIngredientCreate(ingredient_id=15, amount=100, unit="g"),  # Whole Wheat Pasta
                    RecipeIngredientCreate(ingredient_id=25, amount=50, unit="g"),  # Onion
                    RecipeIngredientCreate(ingredient_id=26, amount=2, unit="whole"),  # Tomato
                    RecipeIngredientCreate(ingredient_id=32, amount=10, unit="ml"),  # Olive Oil
                ]
            ),
            
            # Snack recipes
            RecipeCreate(
                name="Trail Mix",
                description="Energy-packed snack",
                instructions="1. Mix nuts and seeds. 2. Add dark chocolate. 3. Store in container.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=33, amount=30, unit="g"),  # Almonds
                    RecipeIngredientCreate(ingredient_id=36, amount=20, unit="g"),  # Walnuts
                    RecipeIngredientCreate(ingredient_id=44, amount=20, unit="g"),  # Dark Chocolate
                ]
            ),
            RecipeCreate(
                name="Smoothie Bowl",
                description="Antioxidant-rich breakfast bowl",
                instructions="1. Blend banana with yogurt. 2. Pour into bowl. 3. Top with nuts and seeds.",
                ingredients=[
                    RecipeIngredientCreate(ingredient_id=17, amount=1, unit="whole"),  # Banana
                    RecipeIngredientCreate(ingredient_id=6, amount=150, unit="g"),  # Greek Yogurt
                    RecipeIngredientCreate(ingredient_id=37, amount=10, unit="g"),  # Chia Seeds
                    RecipeIngredientCreate(ingredient_id=33, amount=20, unit="g"),  # Almonds
                ]
            ),
        ]
        
        # Create recipes for different users
        for i, recipe in enumerate(recipes_data):
            user_id = db_users[i % len(db_users)].id  # Distribute recipes among users
            db_recipe = crud.create_recipe(db, recipe, user_id)
            print(f"Created recipe: {db_recipe.name} for user {db_users[i % len(db_users)].username}")
        
        # Create sample meal plans
        print("Creating sample meal plans...")
        
        # Get all created recipes for meal plan assignment
        all_recipes = crud.get_recipes(db, skip=0, limit=100)
        
        meal_plans_data = [
            MealPlanCreate(
                name="Healthy Week Plan",
                meal_plan_items=[
                    MealPlanItemCreate(recipe_id=all_recipes[0].id, day_of_week="Monday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[2].id, day_of_week="Monday", meal_type="lunch"),
                    MealPlanItemCreate(recipe_id=all_recipes[4].id, day_of_week="Monday", meal_type="dinner"),
                    MealPlanItemCreate(recipe_id=all_recipes[1].id, day_of_week="Tuesday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[3].id, day_of_week="Tuesday", meal_type="lunch"),
                    MealPlanItemCreate(recipe_id=all_recipes[5].id, day_of_week="Tuesday", meal_type="dinner"),
                    MealPlanItemCreate(recipe_id=all_recipes[7].id, day_of_week="Wednesday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[2].id, day_of_week="Wednesday", meal_type="lunch"),
                    MealPlanItemCreate(recipe_id=all_recipes[4].id, day_of_week="Wednesday", meal_type="dinner"),
                ]
            ),
            MealPlanCreate(
                name="Protein Focus Plan",
                meal_plan_items=[
                    MealPlanItemCreate(recipe_id=all_recipes[0].id, day_of_week="Monday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[2].id, day_of_week="Monday", meal_type="lunch"),
                    MealPlanItemCreate(recipe_id=all_recipes[4].id, day_of_week="Tuesday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[5].id, day_of_week="Tuesday", meal_type="dinner"),
                    MealPlanItemCreate(recipe_id=all_recipes[6].id, day_of_week="Wednesday", meal_type="lunch"),
                ]
            ),
            MealPlanCreate(
                name="Quick & Easy Week",
                meal_plan_items=[
                    MealPlanItemCreate(recipe_id=all_recipes[1].id, day_of_week="Sunday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[3].id, day_of_week="Sunday", meal_type="lunch"),
                    MealPlanItemCreate(recipe_id=all_recipes[6].id, day_of_week="Sunday", meal_type="dinner"),
                    MealPlanItemCreate(recipe_id=all_recipes[7].id, day_of_week="Monday", meal_type="breakfast"),
                    MealPlanItemCreate(recipe_id=all_recipes[2].id, day_of_week="Monday", meal_type="lunch"),
                ]
            ),
        ]
        
        # Create meal plans for different users
        for i, meal_plan in enumerate(meal_plans_data):
            user_id = db_users[i % len(db_users)].id  # Distribute meal plans among users
            db_meal_plan = crud.create_meal_plan(db, meal_plan, user_id)
            print(f"Created meal plan: {db_meal_plan.name} for user {db_users[i % len(db_users)].username}")

        print("Sample data creation completed successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization completed!")