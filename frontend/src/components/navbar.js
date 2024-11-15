import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext-1";

export default function Navbar() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Bank Portal</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Admin-specific navigation */}
            {isAuthenticated && userRole === "admin" && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/transactions">
                  Transaction List
                </NavLink>
              </li>
            )}

            {/* Customer-specific navigation */}
            {isAuthenticated && userRole === "customer" && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/create-transaction">
                  Make a Payment
                </NavLink>
              </li>
            )}

            {/* Unauthenticated user navigation */}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/register">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {/* Logout button for authenticated users */}
            {isAuthenticated && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => {
                  logout();
                  navigate("/login");
                }}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
