import { Router } from "express";

import {
  createTodo,
  completedToto,
  getAllTodo,
  deleteTodo,
  updateTodo,
} from "../controller/todoController";
import { validateRequest } from "../middleware/validateRequest";
import { createTodoSchema } from "../schemas/todoSchemas";
import { requireAuth } from "../middleware/auth";

const router: Router = Router();

router.post(
  "/:projectId",
  validateRequest(createTodoSchema),
  requireAuth,
  createTodo
);
router.get("/", requireAuth, getAllTodo);
router.patch("/:id/toggle", requireAuth, completedToto);
router.delete("/:id", requireAuth, deleteTodo);
router.put("/update-todo/:id", requireAuth, updateTodo);

export default router;
