import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Estenda a interface Request do Express
interface AuthenticatedRequest extends Request {
  user?: any; // ou substitua 'any' pelo tipo correto do objeto 'user'
}

function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }

  const [prefix, token] = tokenHeader.split(" ");

  if (prefix !== "Bearer")
    return res
      .status(401)
      .json({ success: false, message: "Token malformatted." });

  if (!token) {
    return res.status(401).json({ success: false, message: "Without Token." });
  }

  jwt.verify(token, "password", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized." });
    }
    req.user = user;
    next();
  });
}

export default authenticateJWT;
