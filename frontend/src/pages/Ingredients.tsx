import React, { useState, useEffect } from 'react';
import { useApiResource } from '../hooks/useApiResource';
import { useApiHealth } from '../hooks/useApiHealth';
import { PageHeader } from '../components/shared/PageHeader';
import { ApiHealthIndicator } from '../components/shared/ApiHealthIndicator';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorAlert } from '../components/shared/ErrorAlert';
import { IngredientForm } from '../components/ingredients/IngredientForm';
import { IngredientsGrid } from '../components/ingredients/IngredientsGrid';
import { SelectedIngredientView } from '../components/ingredients/SelectedIngredientView';
import { IngredientStats } from '../components/ingredients/IngredientStats';
import type { Ingredient } from '../types';

const Ingredients = () => {
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  
  // Use our custom hooks
  const {
    data: ingredients,
    selectedItem: selectedIngredient,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    deleteItem,
    clearError,
    clearSelection,
  } = useApiResource<Ingredient>('/ingredients/');

  const { isHealthy, checkHealth, isChecking } = useApiHealth();

  // Load ingredients when component mounts
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateIngredient = async (ingredientData: Omit<Ingredient, 'id'>) => {
    await create(ingredientData);
    setShowCreateForm(false);
  };

  const handleViewIngredient = (id: number) => {
    fetchById(id);
  };

  const handleDeleteIngredient = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      await deleteItem(id);
    }
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
        <PageHeader title="Ingredients Data">
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
            {showCreateForm ? 'Cancel' : 'Add New Ingredient'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={fetchAll}
            disabled={loading}
          >
            Refresh Data
          </button>
        </PageHeader>

        {/* Create Ingredient Form */}
        {showCreateForm && (
          <IngredientForm
            onSubmit={handleCreateIngredient}
            onCancel={() => setShowCreateForm(false)}
            isLoading={loading}
            submitLabel="Create Ingredient"
          />
        )}

        {/* Error Display */}
        <ErrorAlert error={error} onDismiss={clearError} />

        {/* Loading Indicator */}
        {loading && <LoadingSpinner />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* All Ingredients */}
          <IngredientsGrid
            ingredients={ingredients}
            selectedIngredient={selectedIngredient}
            onView={handleViewIngredient}
            loading={loading && ingredients.length === 0}
          />

          {/* Selected Ingredient */}
          <SelectedIngredientView
            ingredient={selectedIngredient}
            onClear={clearSelection}
            onDelete={handleDeleteIngredient}
          />
        </div>

        {/* Statistics */}
        <IngredientStats ingredients={ingredients} />
      </div>
    </div>
  );
};

export default Ingredients;
