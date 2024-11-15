// App.js
import './App.css';
import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import TransactionList from "./components/TransactionList";
import TransactionCreate from "./components/TransactionCreate";
import Register from "./components/register";
import Login from "./components/login";
import TransactionDetails from "./components/TransactionDetails";
import { AuthContext } from "./AuthContext-1";

const App = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === "admin" ? (
                <Navigate to="/transactions" />
              ) : (
                <Navigate to="/create-transaction" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {isAuthenticated && userRole === "admin" && (
          <>
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/transaction/:transactionId" element={<TransactionDetails />} />
          </>
        )}
        {isAuthenticated && userRole === "customer" && (
          <Route path="/create-transaction" element={<TransactionCreate />} />
        )}

        {/* Redirect any unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
