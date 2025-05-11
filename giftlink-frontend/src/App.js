import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Navbar from "./components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* the final code will not pass the products to every page, but each page will call the server API */}
        <Route
          path="/app"
          element={<MainPage />}
        />
        <Route
          path="*"
          element={<MainPage />}
        />
      </Routes>
    </>
  );
}

export default App;
