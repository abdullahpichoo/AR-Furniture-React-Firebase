import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { getAuth } from "firebase/auth";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  const auth = getAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top ps-4 pe-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          AR Furniture
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <Link to="/home" className="nav-link">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/assets" className="nav-link">
                  Asset Store
                </Link>
                <button
                  className="nav-link"
                  onClick={() => {
                    auth.signOut();
                    {
                      setTimeout(() => {
                        navigate("/login", { replace: true });
                      }, 50);
                    }
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  SignUp
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
