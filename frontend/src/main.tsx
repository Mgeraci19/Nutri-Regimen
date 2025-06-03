import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ This is what you're missing
import App from './App.js';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
