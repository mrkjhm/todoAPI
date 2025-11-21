import { Router } from "express";
import {
  getAllUser,
  signup,
  login,
  logoutUser,
  refreshToken,
  getUserById,
  deleteUser,
  updateUser,
  getProfile,
} from "../controller/authController";
import { validateRequest } from "../middleware/validateRequest";
import {
  registerSchema,
  loginSchema,
  updateSchema,
} from "../schemas/userSchemas";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/role";

const router: Router = Router();

router.get("/", requireAuth, requireAdmin, getAllUser);
router.post("/signup", validateRequest(registerSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.get("/me", requireAuth, getProfile);
router.get("/:id", requireAuth, requireAdmin, getUserById);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);
router.put(
  "/update-user/:id",
  validateRequest(updateSchema),
  requireAuth,
  requireAdmin,
  updateUser
);

export default router;
