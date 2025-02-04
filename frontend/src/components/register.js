import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState(""); // Error state for validation messages

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated password regex that allows hyphens (-) and other special characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?[\]\\|`~])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>/?[\]\\|`~]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include one letter, one number, and one special character.");
      return;
    }

    try {
      const response = await fetch("https://localhost:3001/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, password, accountNumber, idNumber })
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Failed to register.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError("A network error occurred. Please try again.");
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
          />
          {/* Show error message if password is invalid */}
          {error && <div className="text-danger mt-2">{error}</div>}
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
