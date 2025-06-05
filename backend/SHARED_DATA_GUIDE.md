# Making Default Data Available to All Users

This guide explains how the Nutri-Regimen database initialization creates shared data that's available to all users, and how to query it in your application.

## Overview

The database has been designed to support both user-specific and shared content:

### ✅ Already Shared (Available to All Users)
- **Ingredients** - All 40+ ingredients with nutritional data are global (no user ownership)
- **Public Recipes** - All 10 recipes are marked as `is_public = "true"`

### 🔧 User-Specific (But Can Be Made Shared)
- **Meal Plans** - Currently user-owned, but can be made into templates
- **Weekly Assignments** - User-specific scheduling

## Database Schema Changes

### Recipe Model Updates
```python
class Recipe(Base):
    # ... existing fields ...
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for public recipes
    is_public = Column(String, default="false")  # Public recipes available to all users
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
```

### MealPlan Model Updates
```python
class MealPlan(Base):
    # ... existing fields ...
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for template meal plans
    is_template = Column(String, default="false")  # Template meal plans available to all users
```

## How to Query Shared Data

### 1. Get All Ingredients (Always Shared)
```python
def get_all_ingredients(db: Session):
    """Get all ingredients - they're global by design"""
    return db.query(Ingredient).all()
```

### 2. Get Public Recipes
```python
def get_public_recipes(db: Session):
    """Get all public recipes available to everyone"""
    return db.query(Recipe).filter(Recipe.is_public == "true").all()

def get_user_and_public_recipes(db: Session, user_id: int):
    """Get recipes created by user + all public recipes"""
    return db.query(Recipe).filter(
        or_(
            Recipe.user_id == user_id,
            Recipe.is_public == "true"
        )
    ).all()
```

### 3. Get Template Meal Plans (If Implemented)
```python
def get_template_meal_plans(db: Session):
    """Get all template meal plans available to everyone"""
    return db.query(MealPlan).filter(MealPlan.is_template == "true").all()

def get_user_and_template_meal_plans(db: Session, user_id: int):
    """Get meal plans created by user + all template meal plans"""
    return db.query(MealPlan).filter(
        or_(
            MealPlan.user_id == user_id,
            MealPlan.is_template == "true"
        )
    ).all()
```

## Current Data Available to All Users

### Ingredients (40+ items)
All ingredients are globally available with complete nutritional data:
- **Proteins**: Chicken breast, salmon, turkey, eggs, Greek yogurt, tofu, beans, lentils, quinoa
- **Vegetables**: Broccoli, spinach, bell peppers, carrots, sweet potato, kale, cauliflower, asparagus
- **Fruits**: Banana, apple, berries, orange, avocado
- **Grains**: Brown rice, oats, whole wheat bread, pasta
- **Dairy & Alternatives**: Milk, cheese, almond milk
- **Nuts & Seeds**: Almonds, walnuts, chia seeds
- **Oils & Fats**: Olive oil, coconut oil
- **Herbs & Spices**: Garlic, ginger, basil, oregano

### Public Recipes (10 recipes)
All recipes are marked as public and available to everyone:
1. **Grilled Chicken with Quinoa Bowl** - Protein-packed healthy bowl
2. **Salmon and Sweet Potato Power Bowl** - Omega-3 rich meal
3. **Mediterranean Chickpea Salad** - Fresh vegetarian option
4. **Turkey and Vegetable Stir-Fry** - Quick and healthy dinner
5. **Greek Yogurt Berry Parfait** - Protein-rich breakfast
6. **Vegetarian Lentil Curry** - Hearty plant-based meal
7. **Tofu Buddha Bowl** - Nutritious vegan option
8. **Overnight Oats with Berries** - Make-ahead breakfast
9. **Egg and Vegetable Scramble** - Protein-rich breakfast
10. **Asian-Style Lettuce Wraps** - Light and flavorful

## Frontend Implementation

### Recipe Selection Component
```typescript
// When showing recipes to users, include both their own and public recipes
const useRecipes = (userId: string) => {
  return useQuery(['recipes', userId], async () => {
    const response = await fetch(`/api/recipes?include_public=true&user_id=${userId}`);
    return response.json();
  });
};
```

### Ingredient Search
```typescript
// Ingredients are always global, so no user filtering needed
const useIngredients = () => {
  return useQuery(['ingredients'], async () => {
    const response = await fetch('/api/ingredients');
    return response.json();
  });
};
```

## API Endpoint Updates

### Recipes Endpoint
```python
@app.get("/recipes")
def get_recipes(
    include_public: bool = True,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Recipe)
    
    if user_id and include_public:
        # User's recipes + public recipes
        query = query.filter(
            or_(
                Recipe.user_id == user_id,
                Recipe.is_public == "true"
            )
        )
    elif user_id:
        # Only user's recipes
        query = query.filter(Recipe.user_id == user_id)
    elif include_public:
        # Only public recipes
        query = query.filter(Recipe.is_public == "true")
    
    return query.all()
```

## Benefits of This Approach

1. **Rich Default Content** - New users immediately have access to 40+ ingredients and 10 recipes
2. **Scalable** - Easy to add more public content without affecting user data
3. **Flexible** - Users can still create private recipes while benefiting from shared content
4. **Consistent** - All users see the same high-quality base ingredients and recipes
5. **Extensible** - Can easily add template meal plans, public workout routines, etc.

## Running the Initialization

To populate your database with this shared data:

```bash
cd backend
python init_db.py
```

Or use the helper script:
```bash
cd backend
python run_init_db.py
```

This will create:
- 40+ ingredients (global)
- 4 sample users
- 10 public recipes with ingredient associations
- 4 sample meal plans
- Weekly assignments for testing

All ingredients and recipes will be immediately available to any user who signs up!
