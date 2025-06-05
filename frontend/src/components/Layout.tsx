import React from "react";
import { Link } from 'react-router-dom';
import { AuthButton } from './AuthButton';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> 
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/weekly">Weekly Plan</Link>
                            </li>
                            <li>
                                <Link to="/meal-plan">Meal Planner</Link>
                            </li>
                            <li>
                                <Link to="/ingredients">Ingredients Data</Link>
                            </li>
                            <li>
                                <Link to="/recipes">Recipes Data</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn btn-ghost text-xl uppercase">Nutri-Regimen</a>
                </div>
                <div className="navbar-end">
                    <AuthButton />
                </div>
            </div>
            <main className="">
                {children}
            </main>
        </div>
    );
};

export default Layout;
