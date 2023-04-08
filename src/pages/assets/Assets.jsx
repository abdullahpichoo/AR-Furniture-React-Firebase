import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import app from "../../firebase";

export const Assets = () => {
  //   const user = useSelector(() => state.user);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const auth = getAuth();

  return (
    <>
      <h1>This is the Assets index page!</h1>
      {!!user ? (
        <>
          <p>User is Logged in as {user.email}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              auth.signOut();
              navigate("/login");
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          {setTimeout(() => {
            navigate("/login", { replace: true });
          }, 50)}
        </>
      )}
    </>
  );
};
