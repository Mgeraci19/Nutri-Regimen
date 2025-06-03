import React, { useState } from 'react';
import MealPlanGrid from '../components/MealPlanGrid';
import SaveMealPlanModal from '../components/SaveMealPlanModal';
import LoadMealPlanModal from '../components/LoadMealPlanModal';
import { useMealPlan, daysOfWeek, mealTypes } from '../hooks/useMealPlan';
import { Recipe, SavedMealPlan } from '../types';

const MealPlan = () => {
  const {
    recipes,
    mealPlan,
    savedMealPlans,
    currentMealPlan,
    loading,
    error,
    setError,
    fetchRecipes,
    saveMealPlan,
    loadMealPlan,
    deleteSavedMealPlan,
    assignRecipeToSlot,
    getRecipeForSlot,
    calculateDayNutrition,
    clearMealPlan,
  } = useMealPlan();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [mealPlanName, setMealPlanName] = useState('');
  const [saveAsNew, setSaveAsNew] = useState(false);

  const openSaveModal = () => {
    if (currentMealPlan) {
      setMealPlanName(currentMealPlan.name);
      setSaveAsNew(false);
    } else {
      setMealPlanName('');
      setSaveAsNew(true);
    }
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    await saveMealPlan(mealPlanName, saveAsNew);
    setMealPlanName('');
    setShowSaveModal(false);
    setSaveAsNew(false);
  };

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
            {currentMealPlan && (
              <div className="text-sm opacity-70 mt-1">
                Currently loaded: <span className="font-medium text-primary">{currentMealPlan.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-info" onClick={() => setShowLoadModal(true)}>
              Load Plan
            </button>
            <button
              className="btn btn-success"
              onClick={openSaveModal}
              disabled={mealPlan.filter(slot => slot.recipe).length === 0}
            >
              Save Plan
            </button>
            <button className="btn btn-warning" onClick={clearMealPlan}>
              Clear Plan
            </button>
            <button className="btn btn-primary" onClick={fetchRecipes} disabled={loading}>
              Refresh Recipes
            </button>
          </div>
        </div>

        <SaveMealPlanModal
          visible={showSaveModal}
          mealPlanName={mealPlanName}
          setMealPlanName={setMealPlanName}
          loading={loading}
          saveAsNew={saveAsNew}
          setSaveAsNew={setSaveAsNew}
          onSave={handleSave}
          onClose={() => {
            setShowSaveModal(false);
            setMealPlanName('');
            setSaveAsNew(false);
            setError(null);
          }}
          currentMealPlan={currentMealPlan}
          mealCount={mealPlan.filter(slot => slot.recipe).length}
        />

        <LoadMealPlanModal
          visible={showLoadModal}
          plans={savedMealPlans}
          onSelect={(plan: SavedMealPlan) => {
            loadMealPlan(plan);
            setShowLoadModal(false);
          }}
          onDelete={deleteSavedMealPlan}
          onClose={() => setShowLoadModal(false)}
        />

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <MealPlanGrid
          recipes={recipes}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          daysOfWeek={daysOfWeek}
          mealTypes={mealTypes}
          getRecipeForSlot={getRecipeForSlot}
          assignRecipeToSlot={assignRecipeToSlot}
          calculateDayNutrition={calculateDayNutrition}
          mealPlan={mealPlan}
          savedMealPlans={savedMealPlans}
        />
      </div>
    </div>
  );
};

export default MealPlan;
