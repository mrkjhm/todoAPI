"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized. Please login." });
    if (!req.user.isAdmin)
        return res.status(403).json({ message: "Access denied. Admins only" });
    next();
};
exports.requireAdmin = requireAdmin;
