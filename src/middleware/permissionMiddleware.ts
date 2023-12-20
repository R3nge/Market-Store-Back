import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

function checkPermission(req: Request, res: Response, next: NextFunction) {
  const tokenHeader = req.header("Authorization");

  if (tokenHeader === undefined) {
    return res.json({ status: 403, message: "Access denied." });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefix, token] = tokenHeader.split(" ");

  const permission = jwt.decode(token) as JwtPayload;

  if (permission?.type == "Member") {
    res.json({ status: 403, message: "Access denied." });
  }

  next();
}

export default checkPermission;
