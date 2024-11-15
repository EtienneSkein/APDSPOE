import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    
    // Add user information to req
    req.user = decoded;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Forbidden - invalid token" });
  }
};

export default authenticateToken;
