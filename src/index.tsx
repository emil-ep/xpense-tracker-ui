import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from "react-router-dom";

import AddExpense from './pages/expense/AddExpense';
import { AnalyticsView } from './pages/analytics/AnalyticsView';
import AppLayout from './components/AppLayout';
import { DateRangeProvider } from './context/DateRangeContext';
import { ExpenseView } from './pages/expense/ExpenseView';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import TagManagement from './pages/tagManagement/TagManagementView';
import { ToastContainer } from 'react-toastify';
import { createRoot } from "react-dom/client";
import { setNavigate } from './navigation';
import CustomDashboard from './pages/customDashboard/CustomDashboard';
import Settings from './pages/settings/Settings';
import MfHome from './pages/mf/MfHome';

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set the navigate function when the component mounts
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const isLoginRoute = location.pathname === '/login';

  return (
    <div>
      {isLoginRoute ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <AppLayout>
          <Routes>
            <Route path="/home" element={<ProtectedRoute element={Home} />} />
            <Route path="/add/expense" element={<ProtectedRoute element={AddExpense} />} />
            <Route path="/analytics" element={<ProtectedRoute element={AnalyticsView} />} />
            <Route path="/expense" element={<ProtectedRoute element={ExpenseView}/>} />
            <Route path='/tagManagement' element={<ProtectedRoute element={TagManagement}/>}/>
            <Route path='/customDashboard' element={<ProtectedRoute element={CustomDashboard}/>}/>
            <Route path='/settings' element={<ProtectedRoute element={Settings} />}/>
            <Route path="/mutualFunds" element={<ProtectedRoute element={MfHome} />} />
          </Routes>
        </AppLayout>
      )}
    </div>
  );
};


root.render(
  // <React.StrictMode> This is commented since api calls were going twice
    <Router>
      <DateRangeProvider>
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
      </DateRangeProvider>
    </Router>
    //<React.StrictMode>
);

