import dotenv from "dotenv";
dotenv.config({ path: "../.env.node_backend" });

import jwt from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// Parse JWT_EXPIRATION from environment variables or use a default value
const JWT_EXPIRATION: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRATION
  ? isNaN(Number(process.env.JWT_EXPIRATION))
    ? (process.env.JWT_EXPIRATION as jwt.SignOptions["expiresIn"]) // e.g., "1h", "7d"
    : Number(process.env.JWT_EXPIRATION) // e.g., 3600 (seconds)
  : "1h"; // Default to 1 hour

/**
 * Generates a JWT token for a user.
 * @param userId - The ID of the user.
 * @param role - The role of the user.
 * @returns A signed JWT token.
 */
export function generateToken(userId: number, role: string): string {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

/**
 * Verifies a JWT token.
 * @param token - The JWT token to verify.
 * @returns The decoded token payload if valid.
 * @throws An error if the token is invalid or expired.
 */
export function verifyToken(token: string): jwt.JwtPayload | string {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
}