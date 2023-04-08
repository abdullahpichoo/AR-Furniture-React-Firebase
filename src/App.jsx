import { useState } from "react";
// import "./App.css";
import Login from "./pages/registration/Login";
import Signup from "./pages/registration/Signup";
import Home from "./pages/home/Home";
import { Assets } from "./pages/assets/Assets";
import { New } from "./pages/assets/New";
import { Navbar } from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import "./firebase.js";

function App() {
  return (
    <div className="app">
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/new" element={<New />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
