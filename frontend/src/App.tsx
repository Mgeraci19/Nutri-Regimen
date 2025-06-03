import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Weekly from "./pages/Weekly";
import Ingredients from "./pages/Ingredients";
import Recipes from "./pages/Recipes";
import MealPlan from "./pages/MealPlan";
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/weekly" element={<Weekly />} />
                <Route path="/ingredients" element={<Ingredients />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/meal-plan" element={<MealPlan />} />
                <Route path="*" element={<div>404 - Page not found</div>} />
            </Routes>
        </Layout>
    );
};

export default App;