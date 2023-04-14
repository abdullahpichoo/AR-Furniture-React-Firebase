import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const New = () => {
  const navigate = useNavigate();
  // Getting the Logged In User Context
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);

  const [perc, setPerc] = useState(null);
  const [msg, setMsg] = useState("");

  const [file, setFile] = useState("");
  const [filePath, setFilePath] = useState("");
  const [assetFilePath, setAssetFilePath] = useState("");
  const [imgFilePath, setImgFilePath] = useState("");

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
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (err) => {
          setError(err);
        },
        // async () => {
        //   try {
        //     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        //     // console.log("URL: ", downloadURL);
        //     // await setPath(downloadURL);
        //     // console.log("IMG File: ", path);
        //     if (String(downloadURL).includes(".jpg", ".png", ".jpeg")) {
        //       setImgFilePath((prevImgPath) => [
        //         ...prevImgPath,
        //         ...String(downloadURL),
        //       ]);
        //       console.log("Image URL: " + imgFilePath);
        //     } else {
        //       setAssetFilePath((prevAssetPath) => [
        //         ...prevAssetPath,
        //         ...String(downloadURL),
        //       ]);
        //       console.log("Asset URL: " + assetFilePath);
        //     }
        //   } catch (err) {
        //     console.log("Error: ", err);
        //   }
        // }
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFilePath(downloadURL);
            console.log("FilePath: ", downloadURL);
            // setImgFilePath((prevImgPath) => [
            //   ...prevImgPath,
            //   ...String(downloadURL),
            // ]);
            // console.log("Image URL: " + imgFilePath);
            // setAssetFilePath((prevAssetPath) => [
            //   ...prevAssetPath,
            //   ...String(downloadURL),
            // ]);
            // assetFilePath = String(downloadURL);
            // console.log("Asset URL: " + assetFilePath);
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
        asset_url: assetFilePath,

        asset_name: assetName,
        name,
        description,
        price,
      });
      setMsg("Asset added successfully! Redirecting...");
      setTimeout(() => {
        navigate("/assets", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err);
    }
  };
  return (
    <div>
      {user ? (
        <>
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
                <label className="form-label fw-bold">
                  Furniture Item Name
                </label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of the furniture item you're uploading"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="field mb-3">
                <label className="form-label fw-bold">Asset Name</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of the 3d asset you're uploading"
                  onChange={(e) => setAssetName(e.target.value)}
                  required
                />
              </div>
              <div className="field mb-3">
                <label className="form-label fw-bold">Description</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item Description"
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
              {/* <div className="field mb-3">
                <label className="form-label fw-bold">
                  Asset Preview Image
                </label>
                <span class="ms-2 text-secondary">
                  Supported File Types: .jpg .png .jpeg
                </span>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div> */}
              <div className="field mb-3">
                <label className="form-label fw-bold">3D Asset File</label>
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
                  <button
                    className="btn btn-primary btn-lg w-100"
                    type="submit"
                  >
                    Add Asset
                  </button>
                </>
              )}
            </form>
            {msg && (
              <div
                className="ms-3 me-3 alert alert-success alert-dismissible fade show"
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
  );
};

export default New;
