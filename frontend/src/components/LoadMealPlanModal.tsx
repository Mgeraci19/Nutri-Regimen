import React from 'react';
import { SavedMealPlan } from '../types';

interface Props {
  visible: boolean;
  plans: SavedMealPlan[];
  onSelect: (plan: SavedMealPlan) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const LoadMealPlanModal: React.FC<Props> = ({ visible, plans, onSelect, onDelete, onClose }) => {
  if (!visible) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Load Meal Plan</h3>
        <div className="py-4">
          {plans.length === 0 ? (
            <p>No saved meal plans found.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {plans.map(plan => (
                <div key={plan.id} className="card bg-base-200 p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm opacity-70">
                        {plan.meal_plan_items.length} meals • Created {new Date(plan.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => onSelect(plan)}>
                        Load
                      </button>
                      <button className="btn btn-sm btn-error" onClick={() => onDelete(plan.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadMealPlanModal;
