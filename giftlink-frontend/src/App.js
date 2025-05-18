import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Navbar from "./components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import DetailsPage from "./components/DetailsPage/DetailsPage";
import SearchPage from "./components/SearchPage/SearchPage";
import { Navigate } from "react-router-dom";
import Profile from "./components/Profile/Profile";

function App() {
  // const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Routes>
        {/* the final code will not pass the products to every page, but each page will call the server API */}
        <Route
          path="/"
          element={<MainPage />}
        />
        <Route
          path="/app"
          element={<MainPage />}
        />
        <Route
          path="/app/login"
          element={<LoginPage />}
        />
        <Route
          path="/app/register"
          element={<RegisterPage />}
        />
        <Route
          path="/app/profile"
          element={<Profile />}
        />
        <Route
          path="/app/products/:productId"
          element={<DetailsPage />}
        />
        <Route
          path="/app/search"
          element={<SearchPage />}
        />
        <Route
          path="/app/main"
          element={<Navigate to="/app" />}
        />
        {/* <Route
          path="*"
          element={<MainPage />}
        /> */}
      </Routes>
    </>
  );
}

export default App;
