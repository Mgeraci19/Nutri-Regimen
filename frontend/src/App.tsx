import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import WeeklyPlanner from './pages/WeeklyPlanner';
import Ingredients from './pages/Ingredients';
import Recipes from './pages/Recipes';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth/callback" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/weekly" element={<WeeklyPlanner />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
