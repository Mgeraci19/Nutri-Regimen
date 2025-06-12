import type { Ingredient, Recipe, RecipeIngredient } from '../../types';

// Mock Ingredients
export const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: 'Chicken Breast',
    category: 'Protein',
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 74,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Brown Rice',
    category: 'Grain',
    calories_per_100g: 111,
    protein_per_100g: 2.6,
    carbs_per_100g: 23,
    fat_per_100g: 0.9,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.4,
    sodium_per_100g: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Broccoli',
    category: 'Vegetable',
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.6,
    sugar_per_100g: 1.5,
    sodium_per_100g: 33,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Recipe Ingredients
export const mockRecipeIngredients: RecipeIngredient[] = [
  {
    ingredient_id: 1,
    quantity: 150,
    unit: 'g',
    ingredient: mockIngredients[0]
  },
  {
    ingredient_id: 2,
    quantity: 100,
    unit: 'g',
    ingredient: mockIngredients[1]
  },
  {
    ingredient_id: 3,
    quantity: 200,
    unit: 'g',
    ingredient: mockIngredients[2]
  }
];

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Healthy Chicken Bowl',
    description: 'A nutritious chicken and rice bowl with vegetables',
    instructions: '1. Cook chicken breast\n2. Steam rice\n3. Steam broccoli\n4. Combine and serve',
    user_id: 1,
    ingredient_associations: mockRecipeIngredients
  },
  {
    id: 2,
    name: 'Simple Grilled Chicken',
    description: 'Basic grilled chicken breast',
    instructions: '1. Season chicken\n2. Grill for 6-8 minutes per side\n3. Rest and serve',
    user_id: 1,
    ingredient_associations: [mockRecipeIngredients[0]]
  }
];

// Mock API Responses
export const mockApiResponses = {
  ingredients: {
    success: mockIngredients,
    empty: [],
    single: mockIngredients[0],
    created: { ...mockIngredients[0], id: 4, name: 'New Ingredient' },
    error: { message: 'Failed to fetch ingredients' }
  },
  recipes: {
    success: mockRecipes,
    empty: [],
    single: mockRecipes[0],
    created: { ...mockRecipes[0], id: 3, name: 'New Recipe' },
    error: { message: 'Failed to fetch recipes' }
  }
};

// Mock Form Data
export const mockIngredientFormData = {
  name: 'Test Ingredient',
  category: 'Test Category',
  calories_per_100g: 100,
  protein_per_100g: 10,
  carbs_per_100g: 15,
  fat_per_100g: 5,
  fiber_per_100g: 2,
  sugar_per_100g: 1,
  sodium_per_100g: 50
};

export const mockRecipeFormData = {
  name: 'Test Recipe',
  description: 'A test recipe',
  instructions: 'Test instructions',
  ingredients: [
    {
      ingredient_id: 1,
      quantity: 100,
      unit: 'g'
    }
  ]
};

// Utility functions for creating test data
export const createMockIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  ...mockIngredients[0],
  ...overrides
});

export const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  ...mockRecipes[0],
  ...overrides
});

// Mock API Error Responses
export const mockApiErrors = {
  networkError: new Error('Network error'),
  validationError: new Error('Validation failed'),
  notFoundError: new Error('Resource not found'),
  serverError: new Error('Internal server error')
};
