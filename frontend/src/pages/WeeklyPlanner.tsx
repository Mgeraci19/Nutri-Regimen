import React, { useState, useEffect } from 'react';
import { apiFetch } from '../apiClient';
import type { SavedMealPlan, WeeklyAssignment, CalendarWeek, MonthlyStats } from '../types';

const WeeklyPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [weeklyAssignments, setWeeklyAssignments] = useState<WeeklyAssignment[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<CalendarWeek | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get weeks in current month
  const getWeeksInMonth = (): CalendarWeek[] => {
    const weeks: CalendarWeek[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Find the Monday of the week containing the first day
    const startOfFirstWeek = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfFirstWeek.setDate(firstDay.getDate() - daysToMonday);

    const weekStart = new Date(startOfFirstWeek);
    let weekNumber = 1;

    while (weekStart.getTime() <= lastDay.getTime()) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const assignment = weeklyAssignments.find(
        w => w.week_start_date === formatDateToISO(weekStart)
      );

      weeks.push({
        weekNumber,
        startDate: new Date(weekStart),
        endDate: weekEnd,
        assignment
      });

      weekStart.setDate(weekStart.getDate() + 7);
      weekNumber++;
    }

    return weeks;
  };

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateRange = (start: Date, end: Date): string => {
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    
    if (startMonth === endMonth) {
      return `${startDay}-${endDay}`;
    } else {
      return `${monthNames[startMonth].slice(0, 3)} ${startDay} - ${monthNames[endMonth].slice(0, 3)} ${endDay}`;
    }
  };

  // Fetch saved meal plans
  const fetchSavedMealPlans = async () => {
    try {
      const data = await apiFetch<SavedMealPlan[]>('/users/me/meal-plans/');
      setSavedMealPlans(data);
    } catch (err) {
      console.error('Error fetching saved meal plans:', err);
    }
  };

  // Fetch weekly assignments from backend
  const fetchWeeklyAssignments = async () => {
    try {
      const data = await apiFetch<WeeklyAssignment[]>('/users/me/weekly-assignments/');
      setWeeklyAssignments(data);
    } catch (err) {
      console.error('Error fetching weekly assignments:', err);
      // If endpoint doesn't exist yet, keep empty array
      setWeeklyAssignments([]);
    }
  };

  // Assign meal plan to week using backend
  const assignMealPlanToWeek = async (weekStartDate: string, mealPlanId: number) => {
    setLoading(true);
    setError(null);

    try {
      const assignmentData = {
        week_start_date: weekStartDate,
        meal_plan_id: mealPlanId,
        user_id: 0 // This will be overridden by the backend with the current user's ID
      };

      await apiFetch('/weekly-assignments/', {
        method: 'POST',
        body: JSON.stringify(assignmentData),
      });

      // Refresh assignments after successful creation
      await fetchWeeklyAssignments();
      setShowAssignModal(false);
      setSelectedWeek(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Remove assignment
  const removeAssignment = async (assignmentId: number) => {
    setLoading(true);
    try {
      await apiFetch(`/weekly-assignments/${assignmentId}`, {
        method: 'DELETE',
      });
      await fetchWeeklyAssignments();
      setShowAssignModal(false);
      setSelectedWeek(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = (): MonthlyStats => {
    const weeks = getWeeksInMonth();
    const assignedWeeks = weeks.filter(w => w.assignment);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const allRecipeIds = new Set<number>();

    assignedWeeks.forEach(week => {
      if (week.assignment) {
        week.assignment.meal_plan.meal_plan_items.forEach(item => {
          allRecipeIds.add(item.recipe_id);
          
          // Calculate nutrition for each recipe (simplified - assumes 1 serving per meal)
          item.recipe.ingredient_associations.forEach(ingredient => {
            const factor = ingredient.amount / 100;
            totalCalories += (ingredient.ingredient.calories_per_100g || 0) * factor;
            totalProtein += (ingredient.ingredient.protein_per_100g || 0) * factor;
            totalCarbs += (ingredient.ingredient.carbs_per_100g || 0) * factor;
            totalFat += (ingredient.ingredient.fat_per_100g || 0) * factor;
          });
        });
      }
    });

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      uniqueRecipes: allRecipeIds.size,
      assignedWeeks: assignedWeeks.length,
      totalWeeks: weeks.length
    };
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  useEffect(() => {
    fetchSavedMealPlans();
    fetchWeeklyAssignments();
  }, [currentMonth, currentYear]); // Refetch when month changes

  const weeks = getWeeksInMonth();
  const stats = calculateMonthlyStats();

  return (
    <div className="w-full h-full bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Monthly Meal Plan Assignment</h1>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => navigateMonth('prev')}>
              Previous Month
            </button>
            <div className="flex items-center px-4 py-2 bg-primary text-primary-content rounded-lg">
              <span className="font-semibold">{monthNames[currentMonth]} {currentYear}</span>
            </div>
            <button className="btn btn-outline" onClick={() => navigateMonth('next')}>
              Next Month
            </button>
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Assigned Weeks</div>
            <div className="stat-value">{stats.assignedWeeks}/{stats.totalWeeks}</div>
            <div className="stat-desc">{Math.round((stats.assignedWeeks / stats.totalWeeks) * 100)}% complete</div>
          </div>
          <div className="stat">
            <div className="stat-title">Total Calories</div>
            <div className="stat-value">{stats.totalCalories.toLocaleString()}</div>
            <div className="stat-desc">For the month</div>
          </div>
          <div className="stat">
            <div className="stat-title">Unique Recipes</div>
            <div className="stat-value">{stats.uniqueRecipes}</div>
            <div className="stat-desc">Different meals planned</div>
          </div>
          <div className="stat">
            <div className="stat-title">Avg Daily Protein</div>
            <div className="stat-value">{Math.round(stats.totalProtein / (stats.assignedWeeks * 7))}g</div>
            <div className="stat-desc">Per day when assigned</div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Weekly Calendar */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Weekly Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`card bg-base-100 shadow cursor-pointer transition-colors hover:bg-base-300 ${
                    week.assignment ? 'border-2 border-success' : 'border-2 border-dashed border-base-300'
                  }`}
                  onClick={() => {
                    setSelectedWeek(week);
                    setShowAssignModal(true);
                  }}
                >
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">Week {week.weekNumber}</h3>
                        <p className="text-sm opacity-70">
                          {formatDateRange(week.startDate, week.endDate)}
                        </p>
                      </div>
                      <div className="badge badge-primary">{week.weekNumber}</div>
                    </div>
                    
                    {week.assignment ? (
                      <div className="mt-2">
                        <div className="font-medium text-success">{week.assignment.meal_plan.name}</div>
                        <div className="text-xs opacity-70">
                          {week.assignment.meal_plan.meal_plan_items.length} meals planned
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-center text-base-content/50">
                        Click to assign meal plan
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignModal && selectedWeek && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Assign Meal Plan to Week {selectedWeek.weekNumber}
              </h3>
              <p className="text-sm opacity-70 mb-4">
                {formatDateRange(selectedWeek.startDate, selectedWeek.endDate)}, {monthNames[currentMonth]} {currentYear}
              </p>
              
              <div className="py-4">
                {savedMealPlans.length === 0 ? (
                  <p className="text-center">No saved meal plans found. Create some meal plans first.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedWeek.assignment && (
                      <button
                        className="btn btn-outline btn-error w-full mb-4"
                        onClick={() => removeAssignment(selectedWeek.assignment!.id!)}
                        disabled={loading}
                      >
                        {loading ? 'Removing...' : 'Remove Current Assignment'}
                      </button>
                    )}
                    
                    {savedMealPlans.map(plan => (
                      <div key={plan.id} className="card bg-base-200 p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm opacity-70">
                              {plan.meal_plan_items.length} meals • Created {new Date(plan.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => assignMealPlanToWeek(formatDateToISO(selectedWeek.startDate), plan.id)}
                            disabled={loading}
                          >
                            {loading ? 'Assigning...' : 'Assign'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedWeek(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
