import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";

export const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="d-flex flex-column align-items-center">
      <h1 className="fw-bold text-center">Welcome to AR Furniture Website</h1>
      {user ? (
        <>
          <p>
            You are signed in as: <strong>{user.email}</strong>.
          </p>
          <Link to="/assets" className="btn btn-primary btn-lg">
            Go to Asset Store
          </Link>
        </>
      ) : (
        <>
          <p className="text-center">
            If you're on this website, you're probably a Seller or a Vendor. You
            can start by creating a free account here!
          </p>
          <div class="d-flex gap-3">
            <Link to="/login" className="btn btn-outline-primary btn-lg">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Signup
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
