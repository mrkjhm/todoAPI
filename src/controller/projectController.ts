import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";
import { id } from "zod/v4/locales";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        userId: Number(req.user.id),
      },
    });

    res.status(201).json({
      message: "Created project successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: Number(req.user.id),
      },
      include: {
        todos: {
          orderBy: { id: "asc" }, // optional sorting
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      message: "Fetched projects successfully",
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.project.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateData: any = {};
    if (title) updateData.title = title;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Project updated successfully",
      data: { title: updatedProject.title },
    });
  } catch (error) {
    next(error);
  }
};
