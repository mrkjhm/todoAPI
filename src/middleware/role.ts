import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized. Please login." });
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied. Admins only" });
  next();
};
