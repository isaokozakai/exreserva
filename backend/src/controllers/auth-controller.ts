import { Request, Response } from "express";
import { AuthService } from "../services/auth-service";
import { CreateUserRequest, LoginRequest } from "../types";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const userData: CreateUserRequest = req.body;

      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        return res.status(400).json({
          message: "Email, password, and name are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return res.status(400).json({
          message: "Invalid email format",
        });
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }

      const result = await authService.signup(userData);

      return res.status(201).json({
        message: "User created successfully",
        ...result,
      });
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      if (err.message === "User with this email already exists") {
        return res.status(409).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginRequest = req.body;

      // Validate required fields
      if (!loginData.email || !loginData.password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const result = await authService.login(loginData);

      return res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      if (err.message === "Invalid email or password") {
        return res.status(401).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        user,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }
}
