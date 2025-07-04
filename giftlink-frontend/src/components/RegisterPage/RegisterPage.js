import React, { useState } from "react";

import "./RegisterPage.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showerr, setShowerr] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

const handleRegister = async () => {
  try {
    const apiUrl = `${urlConfig.backendUrl}/api/auth/register`;
    console.log('Attempting registration with:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    // Log the response for debugging
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    // Try to parse as JSON if possible
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (data.authtoken) {
      sessionStorage.setItem('auth-token', data.authtoken);
      sessionStorage.setItem('name', firstName);
      sessionStorage.setItem('email', data.email);
      setIsLoggedIn(true);
      navigate('/app/main');
    } else {
      setShowerr(data.error || 'Registration failed');
    }
  } catch (e) {
    console.error('Error during registration:', e);
    setShowerr(`Registration failed: ${e.message}`);
  }
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="form label">
                FirstName
              </label>
              <br />
              <input
                id="firstName"
                className="form-control"
                placeholder="Enter your firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label
                htmlFor="lastName"
                className="form label">
                LastName
              </label>
              <br />
              <input
                id="lastName"
                className="form-control"
                placeholder="Enter your lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label
                htmlFor="email"
                className="form label">
                email
              </label>
              <br />
              <input
                id="email"
                className="form-control"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="password"
                className="form label">
                Password
              </label>
              <br />
              <input
                id="password"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-danger">{showerr}</div>
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleRegister}>
              Register
            </button>
            <p className="mt-4 text-center">
              Already a member?{" "}
              <a
                href="/app/login"
                className="text-primary">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  ); //end of return
}

export default RegisterPage;
