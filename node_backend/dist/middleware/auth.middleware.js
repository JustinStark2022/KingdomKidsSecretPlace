import { verifyToken as decodeJWT } from "@/utils/token";
export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = decodeJWT(token);
        // attach to req.user for downstream controllers
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
