import React from "react";
import { useEffect, useState } from "react";

import { AuthContext } from "../../AuthContext";
import { useContext } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export const List = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");
  const { user } = useContext(AuthContext);

  let dataList = [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "assets"));
        querySnapshot.forEach((doc) => {
          dataList.push({ id: doc.id, ...doc.data() });
        });
        setData(dataList);
      } catch (e) {}
    };
    fetchData();
  }, []);

  async function handleDelete(id) {
    try {
      const res = await deleteDoc(doc(db, "assets", id));
      setMsg("Item deleted successfully!");
    } catch (err) {
      setError(err);
    }
    setData(data.filter((item) => item.id !== id));
  }

  return (
    <div>
      {!!user ? (
        <>
          <table className="table table-hover border border-1">
            <thead className="table-primary">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
                <th scope="col">Belongs To</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, id) => {
                return (
                  <tr key={id}>
                    <td>{item.name}</td>
                    <td className="mw-25 col-md-6">{item.description}</td>
                    <td>{item.price}</td>
                    <td>{item.user}</td>
                    {item.user === user.email && (
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={async () => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {msg && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>{msg}</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
        </>
      ) : (
        <>
          {setTimeout(() => {
            navigate("/login", { replace: true });
          }, 50)}
        </>
      )}
    </div>
  );
};
