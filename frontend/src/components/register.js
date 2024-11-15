import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:3001/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, password, accountNumber, idNumber })
      });
      if (response.ok) {
        navigate("/login");
      } else {
        alert("Failed to register.");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            pattern="^[a-zA-Z\s]{2,50}$"
            title="Please enter a valid full name (letters and spaces only, 2-50 characters)"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="Password must be at least 8 characters long and include at least one letter and one number"
          />
        </div>
        <div className="mb-3">
          <label>Account Number</label>
          <input
            type="text"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            pattern="^\d{10,20}$"
            title="Please enter a valid account number (10-20 digits)"
          />
        </div>
        <div className="mb-3">
          <label>ID Number</label>
          <input
            type="text"
            className="form-control"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
            pattern="^\d{6,20}$"
            title="Please enter a valid ID number (6-20 digits)"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
