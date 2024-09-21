import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import './index.css';
import Home from "./pages/home/Home";

const container = document.getElementById("root");
//@ts-expect-error
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

