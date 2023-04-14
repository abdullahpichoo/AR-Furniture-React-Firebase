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
  const [imgDownloaded, setImgDownloaded] = useState(false);
  const [assetDownloaded, setAssetDownloaded] = useState(false);

  const AssetInputs = [
    {
      id: "name",
      label: "Furniture Item Name",
      type: "text",
      placeholder: "Name of the furniture item you're uploading",
    },
    {
      id: "asset_name",
      label: "Asset Name",
      type: "text",
      placeholder: "Name of the 3d asset you're uploading",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Description of the the asset you're uploading",
    },
    { id: "price", label: "Price", type: "number", placeholder: "Price" },
  ];

  const [data, setData] = useState({});

  const [error, setError] = useState(null);

  const [perc, setPerc] = useState(null);
  const [msg, setMsg] = useState("");

  const [file, setFile] = useState("");

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
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (String(downloadURL).includes(".jpg", ".png", ".jpeg")) {
              setData((prev) => ({ ...prev, image_url: downloadURL }));
              setImgDownloaded(true);
            } else {
              setData((prev) => ({ ...prev, asset_url: downloadURL }));
              setAssetDownloaded(true);
            }
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };
  console.log(data);
  // Adding data to the Firestore Database
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "assets"), {
        ...data,
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
              {AssetInputs.map((input) => (
                <div className="field mb-3" key={input.id}>
                  <label className="form-label fw-bold">{input.label}</label>
                  <br />
                  <input
                    id={input.id}
                    type={input.type}
                    className="form-control"
                    placeholder={input.placeholder}
                    onChange={handleInput}
                    required
                  />
                </div>
              ))}

              <div className="field mb-3">
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
              </div>
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
                  {imgDownloaded === true && assetDownloaded === true ? (
                    <button
                      className="btn btn-success btn-lg w-100"
                      type="submit"
                    >
                      Add Asset
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-lg w-100"
                      type="submit"
                      disabled
                    >
                      Add Asset
                    </button>
                  )}
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
