import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export const Assets = () => {
  //   const user = useSelector(() => state.user);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const auth = getAuth();

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let dataList = [];
      try {
        const querySnapshot = await getDocs(collection(db, "assets"));
        querySnapshot.forEach((doc) => {
          dataList.push(doc);
          console.log(doc.id, " => ", doc.data());
        });
        setData(list);
      } catch (err) {
        console.log(err);
      }
      fetchData();
    };
  }, []);

  console.log(data);

  return (
    <>
      <h1>This is the Assets index page!</h1>
      {!!user ? (
        <>
          <p>User is Logged in as {user.email}</p>
          <Link to="/assets/new" className="btn btn-primary">
            Add New Asset
          </Link>
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
