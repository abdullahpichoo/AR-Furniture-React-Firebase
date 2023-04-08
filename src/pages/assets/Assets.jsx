import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { AuthContext } from "../../AuthContext";
import { useContext } from "react";

import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import { List } from "./List";

export const Assets = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const auth = getAuth();

  return (
    <div className="card">
      <h1 className="card-header">Your Assets</h1>
      <div className="card-body">
        {!!user ? (
          <>
            <p>Logged In As: {user.email}</p>
            <List />
            <div className="d-flex gap-3">
              <Link to="/assets/new" className="btn btn-primary">
                Add New Asset
              </Link>
            </div>
          </>
        ) : (
          <>
            {setTimeout(() => {
              navigate("/login", { replace: true });
            }, 50)}
          </>
        )}
      </div>
    </div>
  );
};
