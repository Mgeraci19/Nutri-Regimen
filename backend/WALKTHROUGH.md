# Nutri-Regimen Backend Walkthrough

Your backend is a FastAPI application with SQLite database integration using SQLAlchemy as the ORM. Here's a breakdown of how it's structured:

## 1. Database Setup (`database.py`)

This file handles the database connection and session management:

- Creates a SQLite database file (`nutri_regimen.db`)
- Sets up SQLAlchemy engine with appropriate connection parameters
- Defines a session factory for database operations
- Provides a dependency function `get_db()` for FastAPI to inject database sessions into route handlers

## 2. Data Models (`models.py`)

This file defines your SQLAlchemy ORM models that map to database tables:

- `User` - Stores user information (email, username, hashed_password)
- `Ingredient` - Stores nutritional information (name, calories, protein, carbs, fat)
- `Recipe` - Stores recipe information (name, description, instructions)
- `RecipeIngredient` - Association table for recipe-ingredient relationships with amounts
- `MealPlan` - Stores meal plan information (name, user_id, timestamps)
- `MealPlanItem` - Individual meal assignments in a meal plan

## 3. Schemas (`schemas.py`)

This file contains Pydantic models for request/response validation:

- Base schemas define common fields
- Create schemas for data creation (e.g., `UserCreate`, `IngredientCreate`, `RecipeCreate`, `MealPlanCreate`)
- Update schemas for partial updates (e.g., `UserUpdate`)
- Response schemas for API responses (e.g., `User`, `Recipe`, `MealPlan`)

## 4. CRUD Operations (`crud.py`)

This file implements database operations for each model:

- Create operations (e.g., `create_user`, `create_ingredient`, `create_recipe`, `create_meal_plan`)
- Read operations (e.g., `get_user`, `get_ingredient`, `get_recipe`, `get_meal_plan`)
- Update operations (e.g., `update_meal_plan`)
- Delete operations (e.g., `delete_meal_plan`)

## 5. API Endpoints (`main.py`)

This file defines your FastAPI application and API endpoints:

- User endpoints (`/users/`)
- Ingredient endpoints (`/ingredients/`)
- Recipe endpoints (`/recipes/`)
- Meal Plan endpoints (`/meal-plans/`)

## 6. Database Initialization (`init_db.py`)

This script initializes the database with sample data:

- Creates database tables
- Adds sample users (5 users)
- Adds sample ingredients (44 comprehensive ingredients)
- Creates sample recipes (8 recipes with ingredient associations)
- Creates sample meal plans (3 meal plans with meal assignments)

## Database Schema

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│    Users    │     │ RecipeIngredient │     │ Ingredients │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id          │     │ recipe_id        │     │ id          │
│ email       │     │ ingredient_id    │     │ name        │
│ username    │     │ amount           │     │ calories    │
│ password    │     │ unit             │     │ protein     │
└─────────────┘     └──────────────────┘     │ carbs       │
     │                       │               │ fat         │
     │                       │               └─────────────┘
     │                       │                      │
     ▼                       │                      │
┌─────────────┐              │                      │
│   Recipes   │◄─────────────┘                      │
├─────────────┤                                     │
│ id          │                                     │
│ name        │                                     │
│ description │                                     │
│ instructions│                                     │
│ user_id     │                                     │
└─────────────┘                                     │
     │                                              │
     │                                              │
     ▼                                              │
┌─────────────┐     ┌──────────────┐                │
│ MealPlans   │     │MealPlanItems │                │
├─────────────┤     ├──────────────┤                │
│ id          │     │ id           │                │
│ name        │     │ meal_plan_id │                │
│ user_id     │     │ recipe_id    │                │
│ created_at  │     │ day_of_week  │                │
│ updated_at  │     │ meal_type    │                │
└─────────────┘     └──────────────┘                │
                           │                        │
                           └────────────────────────┘
```

## API Endpoints

### Users

- `POST /users/` - Create a new user
- `GET /users/` - Get all users
- `GET /users/{user_id}` - Get a specific user
- `PUT /users/{user_id}` - Update a user
- `DELETE /users/{user_id}` - Delete a user

### Ingredients

- `POST /ingredients/` - Create a new ingredient
- `GET /ingredients/` - Get all ingredients
- `GET /ingredients/{ingredient_id}` - Get a specific ingredient

### Recipes

- `POST /recipes/` - Create a new recipe (requires user_id parameter)
- `GET /recipes/` - Get all recipes
- `GET /recipes/{recipe_id}` - Get a specific recipe

### Meal Plans

- `POST /meal-plans/` - Create a new meal plan (requires user_id parameter)
- `GET /meal-plans/` - Get all meal plans
- `GET /meal-plans/{meal_plan_id}` - Get a specific meal plan
- `PUT /meal-plans/{meal_plan_id}` - Update a meal plan
- `DELETE /meal-plans/{meal_plan_id}` - Delete a meal plan
- `GET /users/{user_id}/meal-plans/` - Get all meal plans for a specific user

## Frontend Integration

The frontend is built with React + TypeScript + Vite and includes:

- **Dashboard** (`/dashboard`) - Overview page with monthly meal planning
- **Meal Planner** (`/meal-plan`) - Interactive weekly meal planning interface
- **Ingredients** (`/ingredients`) - Ingredient management and creation
- **Recipes** (`/recipes`) - Recipe management (fully implemented with creation)
- React Router for navigation between pages

Note: The backend includes JWT authentication endpoints, but most CRUD operations work without authentication for development purposes.

## Running the Application

### Backend
1. Install dependencies: `pip install -r requirements.txt`
2. Initialize the database (optional): `python init_db.py`
3. Start the server: `uvicorn main:app --reload`

### Frontend
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

The API will be available at http://localhost:8000, with interactive documentation at http://localhost:8000/docs.
The frontend will be available at http://localhost:5173.
