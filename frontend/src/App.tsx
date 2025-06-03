import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Weekly from "./pages/Weekly";
import Ingredients from "./pages/Ingredients";
import Recipes from "./pages/Recipes";
import MealPlan from "./pages/MealPlan";

const App = () => {
    const path = window.location.pathname;

    let content;
    switch (path) {
        case "/":
        case "/dashboard":
            content = <Dashboard />;
            break;
        case "/weekly":
            content = <Weekly />;
            break;
        case "/ingredients":
            content = <Ingredients />;
            break;
        case "/recipes":
            content = <Recipes />;
            break;
        case "/meal-plan":
            content = <MealPlan />;
            break;
        default:
            content = <div>404 - Page not found</div>;
    }

    return <Layout>{content}</Layout>;
};

export default App;