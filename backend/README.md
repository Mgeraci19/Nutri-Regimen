# Nutri-Regimen Backend

This is the backend for the Nutri-Regimen application, a nutrition tracking system built with FastAPI and SQLite.

## Database Implementation

The application uses SQLite as its database, with SQLAlchemy as the ORM (Object-Relational Mapping) tool. The database is created programmatically when the application starts.

### Database Structure

The database consists of the following tables:

- **users**: Stores user information
- **foods**: Stores nutritional information about different foods
- **meals**: Stores meal information for users
- **meal_food**: Association table for the many-to-many relationship between meals and foods

## Setup and Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Initialize the database with sample data (optional):

```bash
python init_db.py
```

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

### Foods

- `POST /foods/`: Create a new food
- `GET /foods/`: Get all foods
- `GET /foods/{food_id}`: Get a specific food
- `PUT /foods/{food_id}`: Update a food
- `DELETE /foods/{food_id}`: Delete a food

### Meals

- `POST /meals/`: Create a new meal
- `GET /meals/`: Get all meals
- `GET /meals/{meal_id}`: Get a specific meal
- `PUT /meals/{meal_id}`: Update a meal
- `DELETE /meals/{meal_id}`: Delete a meal
- `GET /users/{user_id}/meals/`: Get all meals for a specific user

## Database Files

- `database.py`: Contains database connection setup and session management
- `models.py`: Defines SQLAlchemy ORM models
- `schemas.py`: Defines Pydantic models for request/response validation
- `crud.py`: Contains database CRUD operations
- `init_db.py`: Script to initialize the database with sample data

## SQLite Database File

The SQLite database is stored in a file named `nutri_regimen.db` in the root directory of the backend. This file is created automatically when the application starts if it doesn't exist.

You can also manually initialize the database with sample data by running the `init_db.py` script.
