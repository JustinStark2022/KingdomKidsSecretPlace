// middleware/auth.middleware.js
import jwt from "jsonwebtoken"; // ✅ ADD THIS

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ attach decoded JWT payload to request
    console.log("✅ Authenticated User:", decoded);
    next();
  } catch (err) {
    console.error("❌ Invalid JWT:", err.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
