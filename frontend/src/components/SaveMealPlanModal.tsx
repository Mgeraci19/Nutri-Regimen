import React from 'react';
import type { SavedMealPlan } from '../types';

interface Props {
  visible: boolean;
  mealPlanName: string;
  setMealPlanName: (v: string) => void;
  loading: boolean;
  saveAsNew: boolean;
  setSaveAsNew: (v: boolean) => void;
  onSave: () => void;
  onClose: () => void;
  currentMealPlan: SavedMealPlan | null;
  mealCount: number;
}

const SaveMealPlanModal: React.FC<Props> = ({
  visible,
  mealPlanName,
  setMealPlanName,
  loading,
  saveAsNew,
  setSaveAsNew,
  onSave,
  onClose,
  currentMealPlan,
  mealCount,
}) => {
  if (!visible) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Save Meal Plan</h3>
        <div className="py-4">
          {currentMealPlan && (
            <div className="mb-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Update existing plan: "{currentMealPlan.name}"</span>
                  <input
                    type="radio"
                    name="save-option"
                    className="radio checked:bg-primary"
                    checked={!saveAsNew}
                    onChange={() => {
                      setSaveAsNew(false);
                      setMealPlanName(currentMealPlan.name);
                    }}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Save as new plan</span>
                  <input
                    type="radio"
                    name="save-option"
                    className="radio checked:bg-primary"
                    checked={saveAsNew}
                    onChange={() => {
                      setSaveAsNew(true);
                      setMealPlanName('');
                    }}
                  />
                </label>
              </div>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {saveAsNew || !currentMealPlan ? 'New Meal Plan Name' : 'Meal Plan Name'}
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter meal plan name"
              className="input input-bordered"
              value={mealPlanName}
              onChange={(e) => setMealPlanName(e.target.value)}
              disabled={!saveAsNew && !!currentMealPlan}
            />
          </div>
          <div className="mt-4 text-sm">
            <strong>Meals to save:</strong> {mealCount} recipes
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-success"
            onClick={onSave}
            disabled={loading || !mealPlanName.trim()}
          >
            {loading ? 'Saving...' : saveAsNew || !currentMealPlan ? 'Save New' : 'Update'}
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveMealPlanModal;
