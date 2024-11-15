// TransactionList.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext-1';

const TransactionList = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://localhost:3001/transaction/list", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (error) {
        setError("An error occurred while fetching transactions");
        console.error(error);
      }
    };

    fetchTransactions();
  }, [token]);

  if (error) {
    return <div className="container mt-5"><h3>{error}</h3></div>;
  }

  if (transactions.length === 0) {
    return <div className="container mt-5"><h3>No transactions found</h3></div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Transaction List</h2>
      <ul className="list-group">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="list-group-item d-flex justify-content-between align-items-center">
            Transaction #{transaction._id}
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/transaction/${transaction._id}`)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
  