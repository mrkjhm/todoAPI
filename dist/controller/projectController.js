"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = exports.deleteProject = exports.getAllProjects = exports.createProject = void 0;
const client_1 = require("../prisma/client");
const createProject = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title } = req.body;
        const project = await client_1.prisma.project.create({
            data: {
                title,
                userId: Number(req.user.id),
            },
        });
        res.status(201).json({
            message: "Created project successfully",
            project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const getAllProjects = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const projects = await client_1.prisma.project.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProjects = getAllProjects;
const deleteProject = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }
        const project = await client_1.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        await client_1.prisma.project.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Project deleted successfully",
            project,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
const updateProject = async (req, res, next) => {
    try {
        const { title } = req.body;
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }
        const project = await client_1.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        const updatedProject = await client_1.prisma.project.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({
            message: "Project updated successfully",
            data: { title: updatedProject.title },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
