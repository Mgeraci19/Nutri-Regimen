# Nutri-Regimen Backend

This is the backend for the Nutri-Regimen application, a nutrition tracking and meal planning system built with FastAPI and SQLite.

## Database Implementation

The application uses SQLite as its database, with SQLAlchemy as the ORM (Object-Relational Mapping) tool. The database is created programmatically when the application starts.

### Database Structure

The database consists of the following tables:

- **users**: Stores user information (id, email, username, hashed_password)
- **ingredients**: Stores nutritional information about different ingredients (id, name, calories, protein, carbs, fat)
- **recipes**: Stores recipe information with instructions (id, name, description, instructions, user_id)
- **recipe_ingredients**: Association table linking recipes to ingredients with amounts (recipe_id, ingredient_id, amount, unit)
- **meal_plans**: Stores meal plan information for users (id, name, user_id, created_at, updated_at)
- **meal_plan_items**: Individual meal assignments within meal plans (id, meal_plan_id, recipe_id, day_of_week, meal_type)

## Setup and Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Initialize the database with sample data (optional):

```bash
python init_db.py
```

This will create 5 sample users, 44 ingredients, 8 recipes, and 3 meal plans.

3. Run the application:

```bash
uvicorn main:app --reload
```

The application will be available at http://localhost:8000.

## API Documentation

Once the application is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Users

- `POST /users/`: Create a new user
- `GET /users/`: Get all users
- `GET /users/{user_id}`: Get a specific user
- `PUT /users/{user_id}`: Update a user
- `DELETE /users/{user_id}`: Delete a user

### Ingredients

- `POST /ingredients/`: Create a new ingredient
- `GET /ingredients/`: Get all ingredients
- `GET /ingredients/{ingredient_id}`: Get a specific ingredient

### Recipes

- `POST /recipes/?user_id={user_id}`: Create a new recipe (with ingredients)
- `GET /recipes/`: Get all recipes
- `GET /recipes/{recipe_id}`: Get a specific recipe

### Meal Plans

- `POST /meal-plans/?user_id={user_id}`: Create a new meal plan
- `GET /meal-plans/`: Get all meal plans
- `GET /meal-plans/{meal_plan_id}`: Get a specific meal plan
- `PUT /meal-plans/{meal_plan_id}`: Update a meal plan
- `DELETE /meal-plans/{meal_plan_id}`: Delete a meal plan
- `GET /users/{user_id}/meal-plans/`: Get all meal plans for a specific user

## Database Files

- `database.py`: Contains database connection setup and session management
- `models.py`: Defines SQLAlchemy ORM models
- `schemas.py`: Defines Pydantic models for request/response validation
- `crud.py`: Contains database CRUD operations
- `init_db.py`: Script to initialize the database with comprehensive sample data

## SQLite Database File

The SQLite database is stored in a file named `nutri_regimen.db` in the root directory of the backend. This file is created automatically when the application starts if it doesn't exist.

The `init_db.py` script will remove and recreate the database file each time it's run, so use it carefully in development.

## Frontend Integration

This backend is designed to work with the React + TypeScript frontend located in the `frontend/` directory. The frontend includes:

- Interactive meal planning interface
- Ingredient management
- Recipe viewing (creation UI in progress)
- Simple navigation without React Router

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite default)
- http://localhost:5174 (Vite alternative)
- http://localhost:3000 (Create React App default)
