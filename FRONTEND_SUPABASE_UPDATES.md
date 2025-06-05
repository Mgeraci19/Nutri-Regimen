# Frontend Supabase Integration Updates

This document summarizes the changes made to connect the frontend to the Supabase database and update API calls to use the new schema.

## Issues Fixed

### 1. Updated Type Definitions (`frontend/src/types.ts`)

**Problem**: The `Ingredient` interface was using the old schema with simple field names.

**Solution**: Updated to match the new backend schema:
```typescript
// OLD
interface Ingredient {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// NEW
interface Ingredient {
  id: number;
  name: string;
  category?: string;
  calories_per_100g?: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  created_at?: string;
  updated_at?: string;
}
```

Added a legacy interface for backward compatibility.

### 2. Fixed API Endpoints (`frontend/src/pages/WeeklyPlanner.tsx`)

**Problem**: Using hardcoded user IDs instead of authenticated user endpoints.

**Solution**: Updated API calls:
```typescript
// OLD
'/users/1/meal-plans/'
'/users/1/weekly-assignments/'

// NEW
'/users/me/meal-plans/'
'/users/me/weekly-assignments/'
```

**Problem**: Hardcoded user_id in assignment creation.

**Solution**: Removed hardcoded user_id since backend automatically sets it from authenticated user:
```typescript
// OLD
const assignmentData = {
  week_start_date: weekStartDate,
  meal_plan_id: mealPlanId,
  user_id: 1
};

// NEW
const assignmentData = {
  week_start_date: weekStartDate,
  meal_plan_id: mealPlanId,
  user_id: 0 // This will be overridden by the backend
};
```

### 3. Updated Nutrition Calculations

**Problem**: Nutrition calculations were using old ingredient field names.

**Solution**: Updated to use new schema field names:
```typescript
// OLD
totalCalories += ingredient.ingredient.calories * factor;
totalProtein += ingredient.ingredient.protein * factor;

// NEW
totalCalories += (ingredient.ingredient.calories_per_100g || 0) * factor;
totalProtein += (ingredient.ingredient.protein_per_100g || 0) * factor;
```

### 4. Fixed Meal Plan Hook (`frontend/src/hooks/useMealPlan.ts`)

**Problem**: Multiple issues with API endpoints and nutrition calculations.

**Solutions**:
- Updated import to use type-only imports for TypeScript compliance
- Changed API endpoint from `/users/1/meal-plans/` to `/users/me/meal-plans/`
- Fixed nutrition calculation to use new ingredient schema
- Removed hardcoded user_id from meal plan creation endpoint

### 5. Updated Recipes Component (`frontend/src/pages/Recipes.tsx`)

**Problem**: Using local interface definitions and hardcoded user_id.

**Solutions**:
- Replaced local interfaces with shared types from `../types`
- Removed hardcoded user_id from recipe creation endpoint
- Fixed TypeScript import issues

## API Client Already Updated

The `frontend/src/apiClient.ts` was already properly configured to:
- Automatically include Supabase session tokens in requests
- Handle authentication headers correctly
- Provide proper error handling

## Authentication Integration

The frontend already has proper Supabase authentication integration:
- `frontend/src/lib/supabase.ts` - Supabase client configuration
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/components/AuthButton.tsx` - Social login UI

## Backend Compatibility

The backend (`backend/main.py`) already has the correct endpoints that:
- Use Supabase authentication (`get_current_user` dependency)
- Automatically set user_id from authenticated user
- Provide proper authorization checks
- Support the new schema structure

## Key Benefits

1. **Proper Authentication**: All API calls now use authenticated user context instead of hardcoded IDs
2. **Schema Consistency**: Frontend types match backend models
3. **Type Safety**: Proper TypeScript types prevent runtime errors
4. **Future-Proof**: Uses the new ingredient schema with detailed nutritional information
5. **Security**: No more hardcoded user IDs, proper user isolation

## Testing Recommendations

1. **Authentication Flow**: Test login/logout with Supabase providers
2. **API Calls**: Verify all endpoints work with authenticated users
3. **Data Creation**: Test creating recipes, meal plans, and weekly assignments
4. **Nutrition Calculations**: Verify nutrition calculations work with new schema
5. **User Isolation**: Ensure users only see their own data

## Next Steps

1. Test the application with actual Supabase authentication
2. Verify all API endpoints work correctly
3. Add sample data to test the new schema
4. Consider adding error boundaries for better error handling
5. Test the nutrition calculations with real ingredient data
