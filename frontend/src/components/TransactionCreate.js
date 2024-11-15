import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext-1';

export default function TransactionCreate() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [provider, setProvider] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [payToAccountNumber, setPayToAccountNumber] = useState("");
  const { isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      alert("You must be logged in to create a transaction.");
      return;
    }

    try {
      const response = await fetch("https://localhost:3001/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount, currency, provider, swiftCode, payToAccountNumber })
      });
      if (response.ok) {
        navigate("/"); // Redirect to homepage after submission
      } else {
        alert("Failed to create transaction.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Create Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            pattern="^\d+(\.\d{1,2})?$"
            title="Please enter a valid amount (e.g., 100 or 100.50)"
          />
        </div>
        <div className="mb-3">
          <label>Currency</label>
          <input
            type="text"
            className="form-control"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            pattern="^[A-Z]{3}$"
            title="Please enter a valid 3-letter currency code (e.g., USD, EUR)"
          />
        </div>
        <div className="mb-3">
          <label>Provider</label>
          <input
            type="text"
            className="form-control"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            required
            pattern="^[a-zA-Z\s]{2,50}$"
            title="Please enter a valid provider name (letters and spaces only, 2-50 characters)"
          />
        </div>
        <div className="mb-3">
          <label>SWIFT Code</label>
          <input
            type="text"
            className="form-control"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            required
            pattern="^[A-Z0-9]{8,11}$"
            title="Please enter a valid SWIFT code (8-11 alphanumeric characters)"
          />
        </div>
        <div className="mb-3">
          <label>Pay to Account Number</label>
          <input
            type="text"
            className="form-control"
            value={payToAccountNumber}
            onChange={(e) => setPayToAccountNumber(e.target.value)}
            required
            pattern="^\d{10,20}$"
            title="Please enter a valid account number (10-20 digits)"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit Payment</button>
      </form>
    </div>
  );
}
