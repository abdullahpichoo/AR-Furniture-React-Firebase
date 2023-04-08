import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        Navigate("/login");
        console.log(user);
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <div className="login">
      <div className="card">
        <h1 className="card-header text-center fw-bold mb-3">Signup</h1>
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
        <form onSubmit={handleLogin} className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
