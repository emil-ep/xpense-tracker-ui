import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./pages/login/Login";
import './index.css';

const container = document.getElementById("root");
//@ts-expect-error
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
