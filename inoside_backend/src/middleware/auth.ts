import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import { jwt as jwtConfig } from "../config/keys";
const { secret, tokenLife } = jwtConfig;

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | string;
  }
}

interface UserPayload {
  userId: string;
  roles?: string[];
  email: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header is missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret as string) as JwtPayload;

    if (!decoded.roles || decoded.roles.length === 0) {
      return res.status(403).json({ error: "Unauthorized: Missing roles." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const generateToken = (user: UserPayload): string => {
  const payload: JwtPayload = {
    userId: user.userId,
    roles: user.roles ?? ["USERS"],
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, secret as string, { expiresIn: tokenLife });
};
