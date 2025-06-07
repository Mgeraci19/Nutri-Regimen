import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../apiClient';
import type { WeeklyAssignment, SavedMealPlan } from '../types';

interface DashboardStats {
  totalAssignedWeeks: number;
  totalWeeksInMonth: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  uniqueRecipes: number;
  currentWeekAssignment?: WeeklyAssignment;
  dailyAverages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Dashboard = () => {
  const [weeklyAssignments, setWeeklyAssignments] = useState<WeeklyAssignment[]>([]);
  const [savedMealPlans, setSavedMealPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const user = 'User';

  // Get weeks in current month
  const getWeeksInCurrentMonth = () => {
    const weeks = [];
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

      const weekStartISO = weekStart.toISOString().split('T')[0];
      const assignment = weeklyAssignments.find(w => w.week_start_date === weekStartISO);

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

  // Get current week assignment
  const getCurrentWeekAssignment = (): WeeklyAssignment | undefined => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() - daysToMonday);
    const currentWeekISO = mondayOfCurrentWeek.toISOString().split('T')[0];
    
    return weeklyAssignments.find(w => w.week_start_date === currentWeekISO);
  };

  // Calculate dashboard statistics
  const calculateStats = (): DashboardStats => {
    const weeks = getWeeksInCurrentMonth();
    const assignedWeeks = weeks.filter(w => w.assignment);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const allRecipeIds = new Set<number>();

    assignedWeeks.forEach(week => {
      if (week.assignment && week.assignment.meal_plan && week.assignment.meal_plan.meal_plan_items) {
        week.assignment.meal_plan.meal_plan_items.forEach(item => {
          allRecipeIds.add(item.recipe_id);
          
          // Calculate nutrition for each recipe
          if (item.recipe && item.recipe.ingredient_associations) {
            item.recipe.ingredient_associations.forEach(ingredient => {
              if (ingredient.ingredient) {
                const factor = ingredient.quantity / 100;
                totalCalories += (ingredient.ingredient.calories_per_100g || 0) * factor;
                totalProtein += (ingredient.ingredient.protein_per_100g || 0) * factor;
                totalCarbs += (ingredient.ingredient.carbs_per_100g || 0) * factor;
                totalFat += (ingredient.ingredient.fat_per_100g || 0) * factor;
              }
            });
          }
        });
      }
    });

    const totalDays = assignedWeeks.length * 7;
    
    return {
      totalAssignedWeeks: assignedWeeks.length,
      totalWeeksInMonth: weeks.length,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      uniqueRecipes: allRecipeIds.size,
      currentWeekAssignment: getCurrentWeekAssignment(),
      dailyAverages: {
        calories: totalDays > 0 ? Math.round(totalCalories / totalDays) : 0,
        protein: totalDays > 0 ? Math.round(totalProtein / totalDays) : 0,
        carbs: totalDays > 0 ? Math.round(totalCarbs / totalDays) : 0,
        fat: totalDays > 0 ? Math.round(totalFat / totalDays) : 0,
      }
    };
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

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [assignmentsData, mealPlansData] = await Promise.all([
        apiFetch<WeeklyAssignment[]>('/users/me/weekly-assignments/'),
        apiFetch<SavedMealPlan[]>('/users/me/meal-plans/')
      ]);
      
      setWeeklyAssignments(assignmentsData);
      setSavedMealPlans(mealPlansData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set empty arrays as fallback
      setWeeklyAssignments([]);
      setSavedMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const weeks = getWeeksInCurrentMonth();
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="w-full h-full bg-base-100 flex items-center justify-center" data-theme="dark">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content">Loading your meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-base-100" data-theme="dark">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300 w-full p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-base-content">Hi</span>
          <span className="bg-primary text-primary-content px-3 py-1 rounded-full font-medium">
            {user}
          </span>
          <span className="text-base-content">, here is your plan for</span>
          <span className="text-primary font-semibold">{monthNames[currentMonth]}</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error m-4">
          <div className="flex items-center justify-between w-full">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline" onClick={fetchData}>
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-96">
          {/* Quick Actions */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <Link to="/weekly" className="btn btn-primary">
                  <span>📅</span>
                  <span>Plan Monthly Meals</span>
                </Link>
                <Link to="/meal-plan" className="btn btn-success">
                  <span>🍽️</span>
                  <span>Create Meal Plan</span>
                </Link>
                <Link to="/recipes" className="btn btn-secondary">
                  <span>📝</span>
                  <span>View Recipes</span>
                </Link>
                <Link to="/ingredients" className="btn btn-accent">
                  <span>🥕</span>
                  <span>Manage Ingredients</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Current Week */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">This Week</h2>
              {stats.currentWeekAssignment && stats.currentWeekAssignment.meal_plan ? (
                <div>
                  <div className="font-medium text-success mb-2 text-lg">
                    {stats.currentWeekAssignment.meal_plan.name}
                  </div>
                  <div className="text-base-content/70 mb-4">
                    {stats.currentWeekAssignment.meal_plan.meal_plan_items?.length || 0} meals planned
                  </div>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                      const dayMeals = stats.currentWeekAssignment!.meal_plan.meal_plan_items?.filter(
                        item => item.day_of_week === day
                      ) || [];
                      return (
                        <div key={day} className="bg-base-300 p-3 rounded-lg">
                          <div className="font-medium text-base-content text-sm mb-1">{day}</div>
                          {dayMeals.length > 0 ? (
                            <div className="space-y-1">
                              {dayMeals.map((meal, index) => (
                                <div key={index} className="text-xs text-base-content/80">
                                  <span className="badge badge-sm badge-outline mr-1">{meal.meal_type}</span>
                                  {meal.recipe?.name || 'Unknown Recipe'}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-base-content/50">No meals planned</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-base-content/70 mb-4">No plan assigned for this week</div>
                  <Link to="/weekly" className="btn btn-primary">
                    Assign Plan
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="stats stats-vertical shadow bg-base-200">
            <div className="stat">
              <div className="stat-title">Weeks Planned</div>
              <div className="stat-value">{stats.totalAssignedWeeks}/{stats.totalWeeksInMonth}</div>
              <div className="stat-desc">{Math.round((stats.totalAssignedWeeks / stats.totalWeeksInMonth) * 100)}% complete</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Calories</div>
              <div className="stat-value text-primary">{stats.totalCalories.toLocaleString()}</div>
              <div className="stat-desc">For assigned weeks</div>
            </div>
            <div className="stat">
              <div className="stat-title">Unique Recipes</div>
              <div className="stat-value text-secondary">{stats.uniqueRecipes}</div>
              <div className="stat-desc">Different meals</div>
            </div>
          </div>

          {/* Daily Averages */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content">Daily Averages</h2>
              <p className="text-sm text-base-content/70 mb-4">Based on planned weeks</p>
              <div className="stats stats-vertical shadow bg-base-300">
                <div className="stat">
                  <div className="stat-title">Calories</div>
                  <div className="stat-value text-warning">{stats.dailyAverages.calories}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Protein</div>
                  <div className="stat-value text-error">{stats.dailyAverages.protein}g</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Carbs</div>
                  <div className="stat-value text-info">{stats.dailyAverages.carbs}g</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Fat</div>
                  <div className="stat-value text-secondary">{stats.dailyAverages.fat}g</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Calendar Overview */}
        <div className="flex-1 card bg-base-200 shadow-xl">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-content px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
              <div className="text-primary-content/80">
                {stats.totalAssignedWeeks} of {stats.totalWeeksInMonth} weeks planned
              </div>
            </div>
          </div>

          {/* Calendar Table Header */}
          <div className="bg-base-300 border-b border-base-content/20 px-6 py-3">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-base-content">
              <div>Week</div>
              <div>Dates</div>
              <div className="col-span-2">Meal Plan & Recipes</div>
              <div>Status</div>
            </div>
          </div>

          {/* Calendar Rows */}
          <div className="divide-y divide-base-content/10">
            {weeks.map((week) => (
              <div key={week.weekNumber} className="px-6 py-4 hover:bg-base-300/50 transition-colors">
                <div className="grid grid-cols-5 gap-4 items-start">
                  <div>
                    <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium text-sm">
                      {week.weekNumber}
                    </div>
                  </div>
                  
                  <div className="text-sm text-base-content/70">
                    {formatDateRange(week.startDate, week.endDate)}
                  </div>
                  
                  <div className="col-span-2">
                    {week.assignment && week.assignment.meal_plan ? (
                      <div>
                        <div className="font-medium text-base-content mb-1">
                          {week.assignment.meal_plan.name}
                        </div>
                        <div className="text-sm text-base-content/70 mb-2">
                          {week.assignment.meal_plan.meal_plan_items?.length || 0} meals planned
                        </div>
                        {week.assignment.meal_plan.meal_plan_items && week.assignment.meal_plan.meal_plan_items.length > 0 && (
                          <div className="space-y-1">
                            {week.assignment.meal_plan.meal_plan_items.slice(0, 3).map((item, index) => (
                              <div key={index} className="text-xs text-base-content/60">
                                <span className="badge badge-xs badge-outline mr-1">{item.meal_type}</span>
                                {item.recipe?.name || 'Unknown Recipe'}
                              </div>
                            ))}
                            {week.assignment.meal_plan.meal_plan_items.length > 3 && (
                              <div className="text-xs text-base-content/50">
                                +{week.assignment.meal_plan.meal_plan_items.length - 3} more meals
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-base-content/50 text-sm">
                        No plan assigned
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {week.assignment ? (
                      <div className="badge badge-success badge-sm">
                        Planned
                      </div>
                    ) : (
                      <div className="badge badge-warning badge-sm">
                        Pending
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="bg-base-300 border-t border-base-content/20 px-6 py-4 rounded-b-2xl">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                {savedMealPlans.length} saved meal plans available
              </div>
              <div className="flex gap-3">
                <Link to="/meal-plan" className="btn btn-outline btn-sm">
                  Create New Plan
                </Link>
                <Link to="/weekly" className="btn btn-primary btn-sm">
                  Manage Assignments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
