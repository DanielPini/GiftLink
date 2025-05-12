import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link
        className="navbar-brand"
        to="/app">
        GiftLink
      </Link>

      <div
        className="collapse navbar-collapse"
        id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="/home.html"
              className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item">
            <Link
              to="/app"
              className="nav-link">
              Gifts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/app/search"
              className="nav-link">
              Search
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
