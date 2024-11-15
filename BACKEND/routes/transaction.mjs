import express from "express";
import db from "../db/conn.mjs"; // Import the db connection
import authenticateToken from "../middlewares/authMiddleware.js"; // Import the auth middleware
import { ObjectId } from "mongodb"; // Add this import for handling ObjectId

const router = express.Router();

// Create a new transaction (for regular users)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { amount, currency, provider, swiftCode, payToAccountNumber } = req.body;

    // Check if req.user is set properly
    console.log("req.user:", req.user);
    const { id: customerId } = req.user;

    // Proceed with the rest of the logic to create a transaction
    console.log("Creating transaction for customer ID:", customerId);

    // Using MongoDB to create a transaction
    const collection = await db.collection("transactions");
    const newTransaction = {
      customerId,
      amount,
      currency,
      provider,
      swiftCode,
      payToAccountNumber,
      createdAt: new Date(),
      status: "Pending" // Set the initial status of the transaction as "Pending"
    };

    const result = await collection.insertOne(newTransaction);
    console.log("Transaction created successfully", result);

    res.status(201).json({ message: "Transaction created successfully", transactionId: result.insertedId });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// List all transactions (Admin only)
router.get("/list", authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const collection = await db.collection("transactions");
    const transactions = await collection.find({}).toArray();

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get details of a specific transaction (Admin only)
router.get("/:transactionId", authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { transactionId } = req.params;
    const collection = await db.collection("transactions");
    const transaction = await collection.findOne({ _id: new ObjectId(transactionId) });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify a transaction (Admin only) and delete it from the database
router.post("/:transactionId/verify", authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { transactionId } = req.params;
    const collection = await db.collection("transactions");

    // Delete the transaction after verifying
    const result = await collection.deleteOne({ _id: new ObjectId(transactionId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Transaction not found or already processed" });
    }

    res.status(200).json({ message: "Transaction verified and removed successfully" });
  } catch (error) {
    console.error("Error verifying transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Deny a transaction (Admin only) and delete it from the database
router.post("/:transactionId/deny", authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { transactionId } = req.params;
    const collection = await db.collection("transactions");

    // Delete the transaction after denying
    const result = await collection.deleteOne({ _id: new ObjectId(transactionId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Transaction not found or already processed" });
    }

    res.status(200).json({ message: "Transaction denied and removed successfully" });
  } catch (error) {
    console.error("Error denying transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
