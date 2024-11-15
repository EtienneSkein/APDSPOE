import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/conn.mjs";

const router = express.Router();

// Customer Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, password, accountNumber, idNumber } = req.body;
    console.log("Incoming registration data:", req.body); // Log incoming data for verification

    const collection = await db.collection("customers");

    // Check if account number is already used
    const existingCustomer = await collection.findOne({ accountNumber });
    if (existingCustomer) {
      console.log("Account number already in use");
      return res.status(400).json({ message: "Account number already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Insert the new customer, setting isAdmin to false by default
    const newCustomer = {
      name: fullName,
      password: hashedPassword,
      accountNumber,
      idNumber,
      isAdmin: false
    };

    const result = await collection.insertOne(newCustomer);
    console.log("Customer registered successfully", result);

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login (for both Customers and Admins)
router.post("/login", async (req, res) => {
    try {
      const { accountNumber, password } = req.body;
      const collection = await db.collection("customers");
  
      const customer = await collection.findOne({ accountNumber });
      if (!customer || !(await bcrypt.compare(password, customer.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: customer._id, name: customer.name, isAdmin: customer.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      
      res.json({ token, isAdmin: customer.isAdmin });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default router;