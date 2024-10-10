import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
//@ts-expect-error
const root = createRoot(container);

root.render(
  <div>
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
      </Routes>
    </Router>
  </div>
  
);

