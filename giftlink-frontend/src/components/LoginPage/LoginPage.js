import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  //insert code here to create useState hook variables for email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem("bearer-token");
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/app");
    }
  }, [navigate]);

  // insert code here to create handleLogin function and include console.log
  const handleLogin = async () => {
    try {
      // Implement API call
      const response = await fetch("/api/auth/login", {
        // Set method
        method: "POST",
        // Set headers
        headers: {
          "content-type": "application/json",
          Authorization: bearerToken ? `Bearer ${bearerToken}` : "", // Include bearer token if available
        },
        // Set body to send user details
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      // Access data and set user details

      const json = await response.json();
      console.log("JSON: " + json);

      if (json.authtoken) {
        sessionStorage.setItem("auth-token", json.authtoken);
        sessionStorage.setItem("name", json.userName);
        sessionStorage.setItem("email", json.userEmail);

        setIsLoggedIn(true);
        navigate("/app");
      } else {
        setEmail("");
        setPassword("");
        setIncorrect("Wrong password. Try again.");

        setTimeout(() => {
          setIncorrect("");
        }, 2000);
      }
    } catch (error) {
      console.log("Error fetching details: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            {/* insert code here to create input elements for the variables email and  password */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="password"
                className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                style={{
                  color: "red",
                  display: "block",
                  fontStyle: "italic",
                  fontSize: "12px",
                }}>
                {incorrect}
              </span>
            </div>

            {/* insert code here to create a button that performs the `handleLogin` function on click */}
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleLogin}>
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{" "}
              <a
                href="/app/register"
                className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
