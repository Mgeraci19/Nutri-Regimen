import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Weekly from "./pages/Weekly";

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
        default:
            content = <div>404 - Page not found</div>;
    }

    return <Layout>{content}</Layout>;
};

export default App;
