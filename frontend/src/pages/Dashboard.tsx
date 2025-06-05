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
                const factor = ingredient.amount / 100;
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
        apiFetch<WeeklyAssignment[]>('/users/1/weekly-assignments/'),
        apiFetch<SavedMealPlan[]>('/users/1/meal-plans/')
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
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="text-gray-600">Loading your meal plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 w-full p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Hi</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">
            {user}
          </span>
          <span className="text-gray-700">, here is your plan for</span>
          <span className="text-blue-600 font-semibold">{monthNames[currentMonth]}</span>
        </div>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-red-800">{error}</span>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" onClick={fetchData}>
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6 p-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-96">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link to="/weekly" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>📅</span>
                <span>Plan Monthly Meals</span>
              </Link>
              <Link to="/meal-plan" className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <span>🍽️</span>
                <span>Create Meal Plan</span>
              </Link>
              <Link to="/recipes" className="flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span>📝</span>
                <span>View Recipes</span>
              </Link>
              <Link to="/ingredients" className="flex items-center gap-3 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <span>🥕</span>
                <span>Manage Ingredients</span>
              </Link>
            </div>
          </div>

          {/* Current Week */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
            {stats.currentWeekAssignment && stats.currentWeekAssignment.meal_plan ? (
              <div>
                <div className="font-medium text-green-700 mb-2 text-lg">
                  {stats.currentWeekAssignment.meal_plan.name}
                </div>
                <div className="text-gray-600 mb-4">
                  {stats.currentWeekAssignment.meal_plan.meal_plan_items?.length || 0} meals planned
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const dayMeals = stats.currentWeekAssignment!.meal_plan.meal_plan_items?.filter(
                      item => item.day_of_week === day
                    ) || [];
                    return (
                      <div key={day} className="bg-gray-50 border border-gray-200 p-2 rounded text-center">
                        <div className="font-medium text-gray-900 text-sm">{day.slice(0, 3)}</div>
                        <div className="text-gray-600 text-xs">{dayMeals.length} meals</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-gray-500 mb-4">No plan assigned for this week</div>
                <Link to="/weekly" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Assign Plan
                </Link>
              </div>
            )}
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Monthly Overview</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalAssignedWeeks}/{stats.totalWeeksInMonth}</div>
                <div className="text-sm text-gray-600">Weeks Planned</div>
                <div className="text-xs text-blue-600">{Math.round((stats.totalAssignedWeeks / stats.totalWeeksInMonth) * 100)}% complete</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalCalories.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Calories</div>
                <div className="text-xs text-gray-500">For assigned weeks</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.uniqueRecipes}</div>
                <div className="text-sm text-gray-600">Unique Recipes</div>
                <div className="text-xs text-gray-500">Different meals</div>
              </div>
            </div>
          </div>

          {/* Daily Averages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Daily Averages</h3>
              <p className="text-xs text-gray-600">Based on planned weeks</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-200">
              <div className="bg-white p-4">
                <div className="text-xl font-bold text-orange-600">{stats.dailyAverages.calories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-xl font-bold text-red-600">{stats.dailyAverages.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-xl font-bold text-yellow-600">{stats.dailyAverages.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-xl font-bold text-purple-600">{stats.dailyAverages.fat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Calendar Overview */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
              <div className="text-blue-100">
                {stats.totalAssignedWeeks} of {stats.totalWeeksInMonth} weeks planned
              </div>
            </div>
          </div>

          {/* Calendar Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
              <div>Week</div>
              <div>Dates</div>
              <div className="col-span-2">Meal Plan</div>
              <div>Status</div>
            </div>
          </div>

          {/* Calendar Rows */}
          <div className="divide-y divide-gray-100">
            {weeks.map((week) => (
              <div key={week.weekNumber} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div>
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium text-sm">
                      {week.weekNumber}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {formatDateRange(week.startDate, week.endDate)}
                  </div>
                  
                  <div className="col-span-2">
                    {week.assignment && week.assignment.meal_plan ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {week.assignment.meal_plan.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {week.assignment.meal_plan.meal_plan_items?.length || 0} meals planned
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No plan assigned
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {week.assignment ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Planned
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {savedMealPlans.length} saved meal plans available
              </div>
              <div className="flex gap-3">
                <Link to="/meal-plan" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Create New Plan
                </Link>
                <Link to="/weekly" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
