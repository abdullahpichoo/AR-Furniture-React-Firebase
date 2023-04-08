import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";

export const New = () => {
  // Getting the Logged In User Context
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [filePath, setFilePath] = useState("");
  const [perc, setPerc] = useState(null);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, `assets/${user.email}/${name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (err) => {
          setError(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFilePath(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // Adding data to the Firestore Database
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "assets"), {
        user: user.email,
        url: filePath,
        name,
        description,
        price,
      });
      setTimeout(() => {
        navigate("/assets", { replace: true });
      }, 50);
      console.log(res);
    } catch (err) {
      setError(err);
    }
  };
  return (
    <div>
      <div className="card">
        {/* Card Header */}
        <h1 className="text-center card-header">Add New Asset</h1>
        {/* Printing Error Alert */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>{error}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        {/* Form */}
        <form className="card-body px-4" onSubmit={handleUpload}>
          <div className="field mb-3">
            <label className="form-label fw-bold">Name</label>
            <br />
            <input
              type="text"
              className="form-control"
              placeholder="Asset Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field mb-3">
            <label className="form-label fw-bold">Description</label>
            <br />
            <input
              type="text"
              className="form-control"
              placeholder="Product Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field mb-3">
            <label className="form-label fw-bold">Price</label>
            <br />
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="field mb-3">
            <label className="form-label fw-bold">Asset File</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          {perc !== null && perc < 100 ? (
            <button
              className="btn btn-primary d-flex gap-2 justify-content-center align-items-center p-2 w-100"
              type="button"
              disabled
            >
              <span
                className="spinner-border spinner-border"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="fs-5">Uploading Asset...</span>
            </button>
          ) : (
            <>
              <button className="btn btn-primary btn-lg w-100" type="submit">
                Add Asset
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default New;
