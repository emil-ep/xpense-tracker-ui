import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import { createRoot } from "react-dom/client";
import AddExpense from './pages/expense/AddExpense';
import React, { useEffect } from 'react';
import { setNavigate } from './navigation';

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  // Set the navigate function when the component mounts
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute element={Home} />} />
      <Route path='/expense' element={<ProtectedRoute element={AddExpense} />} />
    </Routes>
  );
};


root.render(
  <React.StrictMode>
    <Router>
      <div>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
        <AppRoutes />
      </div>
    </Router>
  </React.StrictMode>
  
  
  
);

