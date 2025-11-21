import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is requried"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
});
