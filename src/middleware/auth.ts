import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 🔍 1. Get access token from HttpOnly cookies
  // If the cookie is missing → user is not authenticated
  const token = req.cookies?.accessToken;

  if (!token) {
    // 🔥 401 = Unauthorized (Authentication required)
    // This message indicates their login session has ended
    return res
      .status(401)
      .json({ message: "Session expired. Please login again." });
  }

  try {
    // 🔐 2. Verify JWT using the ACCESS_TOKEN_SECRET
    // If token is valid → we extract its payload
    const payload = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as {
      sub: string; // user ID (subject)
      isAdmin?: boolean; // optional admin flag
    };

    // 👤 3. Attach authenticated user info to the request object
    // This allows any route/controller to access req.user
    req.user = {
      id: payload.sub,
      isAdmin: payload.isAdmin ?? false, // default to false if missing
    };

    // ✅ 4. Continue to next middleware or controller
    next();
  } catch (error) {
    // ⚠️ Token verification failed (expired, tampered, wrong secret)
    console.error("JWT error:", error);

    // 401 again because the token is invalid or expired
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};
