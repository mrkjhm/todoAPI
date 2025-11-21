import { Router } from "express";
import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controller/projectController";
import { validateRequest } from "../middleware/validateRequest";
import { createProjectSchema } from "../schemas/projectSchemas";
import { requireAuth } from "../middleware/auth";

const router: Router = Router();

router.post(
  "/create-project",
  validateRequest(createProjectSchema),
  requireAuth,
  createProject
);

router.get("/", requireAuth, getAllProjects);
router.delete("/:id", requireAuth, deleteProject);
router.put("/update-project/:id", requireAuth, updateProject);

export default router;
