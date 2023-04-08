import { useState } from "react";
// import "./App.css";
import Login from "./pages/registration/Login";
import Signup from "./pages/registration/Signup";
import Home from "./pages/home/Home";
import { Assets } from "./pages/assets/Assets";
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
  const currentUser = false;
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className="">
      <Router>
        <Navbar />
        <div className="container mt-5">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/assets"
              element={
                <RequireAuth>
                  <Assets />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
