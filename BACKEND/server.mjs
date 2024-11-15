import https from "https";
import express from "express";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import transactions from "./routes/transaction.mjs"; // This handles transaction-related routes
import customers from "./routes/customer.mjs";      // This handles customer signup and login routes

dotenv.config(); // Load environment variables

const PORT = 3001;
const app = express();

// Load SSL certificates
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

// Security Middleware
app.use(helmet()); // Set security-related HTTP headers
app.use(cors()); // Enable CORS
app.use(hpp()); // Prevent HTTP parameter pollution

// Less restrictive rate limiting to prevent DDoS attacks
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 500, // Allow each IP to make up to 500 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

// Attach routes
app.use("/transaction", transactions);  // Handles transaction-related routes
app.use("/customer", customers);        // Handles customer signup and login routes

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});
