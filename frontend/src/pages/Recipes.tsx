import React, { useState, useEffect } from 'react';
import { useApiResource } from '../hooks/useApiResource';
import { useApiHealth } from '../hooks/useApiHealth';
import { PageHeader } from '../components/shared/PageHeader';
import { ApiHealthIndicator } from '../components/shared/ApiHealthIndicator';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorAlert } from '../components/shared/ErrorAlert';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipesGrid } from '../components/recipes/RecipesGrid';
import { SelectedRecipeView } from '../components/recipes/SelectedRecipeView';
import { RecipeStats } from '../components/recipes/RecipeStats';
import type { Recipe, Ingredient } from '../types';

interface RecipeCreateData {
  name: string;
  description: string;
  instructions: string;
  ingredients: Array<{
    ingredient_id: number;
    quantity: number;
    unit: string;
  }>;
}

const Recipes = () => {
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  
  // Use our custom hooks for recipes
  const {
    data: recipes,
    selectedItem: selectedRecipe,
    loading: recipesLoading,
    error: recipesError,
    fetchAll: fetchRecipes,
    fetchById: fetchRecipeById,
    create: createRecipe,
    deleteItem: deleteRecipe,
    clearError: clearRecipesError,
    clearSelection: clearRecipeSelection,
  } = useApiResource<Recipe>('/recipes/');

  // Use our custom hooks for ingredients (needed for the form)
  const {
    data: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
    fetchAll: fetchIngredients,
  } = useApiResource<Ingredient>('/ingredients/');

  const { isHealthy, checkHealth, isChecking } = useApiHealth();

  // Load data when component mounts
  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, [fetchRecipes, fetchIngredients]);

  const handleCreateRecipe = async (recipeData: RecipeCreateData) => {
    // Transform the data to match the expected API format
    const transformedData: Omit<Recipe, 'id'> = {
      name: recipeData.name,
      description: recipeData.description,
      instructions: recipeData.instructions,
      user_id: 1, // TODO: Get from auth context
      ingredient_associations: [], // Will be handled by the API
    };
    
    await createRecipe(transformedData);
    setShowCreateForm(false);
  };

  const handleViewRecipe = (id: number) => {
    fetchRecipeById(id);
  };

  const handleEditRecipe = (id: number) => {
    // TODO: Implement edit functionality
    console.log('Edit recipe:', id);
    // For now, just log the action. In the future, this could open an edit form
    alert(`Edit functionality for recipe ${id} will be implemented soon!`);
  };

  const handleDeleteRecipe = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(id);
    }
  };

  const loading = recipesLoading || ingredientsLoading;
  const error = recipesError || ingredientsError;
  const clearError = () => {
    clearRecipesError();
  };

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        {/* API Health Indicator */}
        <ApiHealthIndicator 
          isHealthy={isHealthy}
          onRetry={checkHealth}
          isChecking={isChecking}
        />

        {/* Page Header */}
        <PageHeader title="Recipes Data">
          <button 
            className="btn btn-info btn-sm" 
            onClick={checkHealth}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Check API'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Add New Recipe'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={fetchRecipes}
            disabled={loading}
          >
            Refresh Data
          </button>
        </PageHeader>

        {/* Create Recipe Form */}
        {showCreateForm && (
          <RecipeForm
            onSubmit={handleCreateRecipe}
            onCancel={() => setShowCreateForm(false)}
            availableIngredients={ingredients}
            isLoading={loading}
            submitLabel="Create Recipe"
          />
        )}

        {/* Error Display */}
        <ErrorAlert error={error} onDismiss={clearError} />

        {/* Loading Indicator */}
        {loading && <LoadingSpinner />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* All Recipes */}
          <RecipesGrid
            recipes={recipes}
            selectedRecipe={selectedRecipe}
            onView={handleViewRecipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            loading={recipesLoading && recipes.length === 0}
          />

          {/* Selected Recipe */}
          <SelectedRecipeView
            recipe={selectedRecipe}
            onClear={clearRecipeSelection}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        </div>

        {/* Statistics */}
        <RecipeStats recipes={recipes} />
      </div>
    </div>
  );
};

export default Recipes;
