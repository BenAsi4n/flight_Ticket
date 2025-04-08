import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Admin from "./pages/AdminDashboard";
import "./components/FlightList.css";

const App = () => {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes> 
    </Router>
  );
};

export default App;