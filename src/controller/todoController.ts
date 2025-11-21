import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const { projectId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const userId = Number(req.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: Number(projectId),
        userId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        userId,
        projectId: Number(projectId),
      },
    });

    res.status(201).json({
      message: "Created todo successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isAdmin = req.user?.isAdmin === true;

    const todos = await (isAdmin
      ? prisma.todo.findMany({
          orderBy: { id: "asc" },
        })
      : prisma.todo.findMany({
          where: { userId: Number(req.user.id) },
          include: { project: true },
          orderBy: { id: "asc" },
        }));

    res.status(200).json({
      message: isAdmin
        ? "Get all todos by admin"
        : "Fetched todos successfully",
      todos,
    });
  } catch (error) {
    next(error);
  }
};

export const completedToto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        isCompleted: !todo.isCompleted,
      },
    });

    return res.status(200).json({
      message: "Todo completed successfully",
      updatedTodo: {
        isCompleted: updatedTodo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return res.status(400).json({ message: "Todo not found" });
    }

    await prisma.todo.delete({ where: { id } });
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;

    const id = Number(req.params.id);
    if (!id) {
      return res.status(404).json({ message: "Invalid todo ID" });
    }

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(404).send({ message: "Todo not found" });
    }

    const updatedData: any = {};
    if (title) updatedData.title = title;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updatedData,
    });

    return res.status(200).json({
      message: "Todo updated successfully",
      data: {
        title: updatedTodo.title,
      },
    });
  } catch (error) {
    next(error);
  }
};
