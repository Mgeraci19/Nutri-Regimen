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
- `Food` - Stores nutritional information (name, calories, protein, carbs, fat)
- `Meal` - Stores meal information (name, date, user_id)
- `meal_food_association` - Association table for the many-to-many relationship between meals and foods

## 3. Schemas (`schemas.py`)

This file contains Pydantic models for request/response validation:

- Base schemas define common fields
- Create schemas for data creation (e.g., `UserCreate`, `FoodCreate`)
- Update schemas for partial updates (e.g., `UserUpdate`, `FoodUpdate`)
- Response schemas for API responses (e.g., `User`, `Food`, `Meal`)

## 4. CRUD Operations (`crud.py`)

This file implements database operations for each model:

- Create operations (e.g., `create_user`, `create_food`, `create_meal`)
- Read operations (e.g., `get_user`, `get_food`, `get_meal`)
- Update operations (e.g., `update_user`, `update_food`, `update_meal`)
- Delete operations (e.g., `delete_user`, `delete_food`, `delete_meal`)

## 5. API Endpoints (`main.py`)

This file defines your FastAPI application and API endpoints:

- User endpoints (`/users/`)
- Food endpoints (`/foods/`)
- Meal endpoints (`/meals/`)
- Relationship endpoints (e.g., `/users/{user_id}/meals/`)

## 6. Database Initialization (`init_db.py`)

This script initializes the database with sample data:

- Creates database tables
- Adds sample users
- Adds sample foods
- Creates sample meals with associations to foods

## Database Schema

```javascript
┌─────────┐     ┌───────────┐     ┌─────────┐
│  Users  │     │ meal_food │     │  Foods  │
├─────────┤     ├───────────┤     ├─────────┤
│ id      │     │ meal_id   │     │ id      │
│ email   │     │ food_id   │     │ name    │
│ username│     └───────────┘     │ calories│
│ password│           │           │ protein │
└─────────┘           │           │ carbs   │
     │                │           │ fat     │
     │                │           └─────────┘
     │                │                │
     │                │                │
     ▼                │                │
┌─────────┐           │                │
│  Meals  │◄──────────┘                │
├─────────┤                            │
│ id      │                            │
│ name    │                            │
│ date    │                            │
│ user_id │                            │
└─────────┘                            │
     │                                 │
     └─────────────────────────────────┘
```

## API Endpoints

### Users

- `POST /users/` - Create a new user
- `GET /users/` - Get all users
- `GET /users/{user_id}` - Get a specific user
- `PUT /users/{user_id}` - Update a user
- `DELETE /users/{user_id}` - Delete a user

### Foods

- `POST /foods/` - Create a new food
- `GET /foods/` - Get all foods
- `GET /foods/{food_id}` - Get a specific food
- `PUT /foods/{food_id}` - Update a food
- `DELETE /foods/{food_id}` - Delete a food

### Meals

- `POST /meals/` - Create a new meal
- `GET /meals/` - Get all meals
- `GET /meals/{meal_id}` - Get a specific meal
- `PUT /meals/{meal_id}` - Update a meal
- `DELETE /meals/{meal_id}` - Delete a meal
- `GET /users/{user_id}/meals/` - Get all meals for a specific user

## Running the Application

To run the application:

1. Install dependencies: `pip install -r requirements.txt`
2. Initialize the database (optional): `python init_db.py`
3. Start the server: `uvicorn main:app --reload`

The API will be available at [](http://localhost:8000,)<http://localhost:8000,> with interactive documentation at [](http://localhost:8000/docs.)<http://localhost:8000/docs.>
