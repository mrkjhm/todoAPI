import { NextFunction, Request, Response } from "express";
import bcrypt, { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookies";
import { ENV } from "../config/env";

export const getAllUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      message: "Get all users",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Summary
    // 1. declare mo muna yung form fields need
    // 2. Check mo kung meron existing user
    // 3. Create user
    // 4. return message na successful ang creation
    // 5. catch error

    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exist!" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    return res.status(201).json({
      message: "User signup successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Summary
    // 1. Validate user credentials
    // 2. Compare passwords
    // 3. Generate access & refresh tokens
    // 4. Store both tokens in secure HttpOnly cookies
    // 5. Return user profile (without password)
    // 6. Handle errors

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create tokens
    const accessToken = createAccessToken({
      sub: String(user.id),
      isAdmin: Boolean(user.isAdmin),
    });

    const refreshToken = createRefreshToken({
      sub: String(user.id),
    });

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie("accessToken", accessTokenCookieOptions);
  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  res.json({ message: "Logget out successfully" });
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Summary
    // 1. Extract the user ID from URL params
    // 2. Validate that it is a valid number
    // 3. Query the user (selecting only safe fields)
    // 4. Return the user or 404 if not found
    // 5. Handle errors
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Summary
    // 1. Extract the user ID from the URL parameters
    // 2. Validate that the ID is a valid number
    // 3. Check if the user exists in the database
    // 4. Delete the user using Prisma
    // 5. Return a success response with basic user info
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      message: "User deleted successfully",
      deleteUser: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Summary
    // 1. Read refresh token from cookies
    // 2. Verify if the token is valid and not expired
    // 3. Decode the user ID (payload.sub)
    // 4. Look up the user in the database
    // 5. Generate new access & refresh tokens
    // 6. Store them in cookies
    // 7. Return the new access token
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    let payload;
    try {
      payload = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as { sub: string };
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken({
      sub: String(user.id),
      isAdmin: Boolean(user.isAdmin),
    });

    const newRefreshToken = createRefreshToken({
      sub: String(user.id),
    });

    res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

    return res.json({
      message: "Tokens refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract fields
    const { name, email, password } = req.body;
    const id = Number(req.params.id);

    // 2. Validate ID
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 3. Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Check if email already exists (optional)
    if (email && email !== user.email) {
      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // 5. Prepare updated data
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = bcrypt.hashSync(password, 10);

    // 6. Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    // 7. Return successful response
    return res.status(200).json({
      message: "User updated successfully",
      updatedUser: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const id = Number(req.user.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
