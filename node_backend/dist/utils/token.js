import dotenv from 'dotenv';
dotenv.config(); // <-- load .env into process.env
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const JWT_EXPIRATION = process.env.JWT_EXPIRATION
    ? (isNaN(Number(process.env.JWT_EXPIRATION))
        ? process.env.JWT_EXPIRATION
        : Number(process.env.JWT_EXPIRATION))
    : "1h";
export function generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
