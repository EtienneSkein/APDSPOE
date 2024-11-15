import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext-1";

const TransactionDetails = () => {
  const { transactionId } = useParams();
  const { token } = useContext(AuthContext);
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(`https://localhost:3001/transaction/${transactionId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
        } else {
          console.error("Failed to fetch transaction details");
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionDetails();
  }, [transactionId, token]);

  const handleVerify = async () => {
    try {
      const response = await fetch(`https://localhost:3001/transaction/${transactionId}/verify`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Transaction verified successfully");
        navigate("/transactions");
      } else {
        alert("Failed to verify transaction");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
    }
  };

  const handleDeny = async () => {
    try {
      const response = await fetch(`https://localhost:3001/transaction/${transactionId}/deny`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Transaction denied successfully");
        navigate("/transactions");
      } else {
        alert("Failed to deny transaction");
      }
    } catch (error) {
      console.error("Error denying transaction:", error);
    }
  };

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Transaction Details</h2>
      <div className="mb-3">
        <strong>Amount:</strong> {transaction.amount}
      </div>
      <div className="mb-3">
        <strong>Currency:</strong> {transaction.currency}
      </div>
      <div className="mb-3">
        <strong>Provider:</strong> {transaction.provider}
      </div>
      <div className="mb-3">
        <strong>SWIFT Code:</strong> {transaction.swiftCode}
      </div>
      <div className="mb-3">
        <strong>Pay To Account Number:</strong> {transaction.payToAccountNumber}
      </div>
      <div className="mb-3">
        <strong>Status:</strong> {transaction.status}
      </div>
      <button className="btn btn-success me-3" onClick={handleVerify}>
        Verify
      </button>
      <button className="btn btn-danger" onClick={handleDeny}>
        Deny
      </button>
    </div>
  );
};

export default TransactionDetails;
