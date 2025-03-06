import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import App from './App';
import './index.css';
import DashBoard from './pages/DashBoard';
import SideBar from './components/SideBar';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
        <App />
  </BrowserRouter>
);