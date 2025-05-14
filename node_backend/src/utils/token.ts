import dotenv from 'dotenv';
dotenv.config({ path: "../.env.node_backend" })

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const JWT_EXPIRATION: jwt.SignOptions["expiresIn"] = process.env.JWT_EXPIRATION 
  ? (isNaN(Number(process.env.JWT_EXPIRATION)) 
      ? (process.env.JWT_EXPIRATION as jwt.SignOptions["expiresIn"]) 
      : (Number(process.env.JWT_EXPIRATION) as jwt.SignOptions["expiresIn"])) 
  : "1h";

export function generateToken(userId: number, role: string) {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
