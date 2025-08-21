import { Request, Response } from "express";
import { AuthService } from "../services/authService";
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

      res.status(201).json({
        message: "User created successfully",
        ...result,
      });
    } catch (error: any) {
      if (error.message === "User with this email already exists") {
        return res.status(409).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Internal server error",
        error: error.message,
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

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Internal server error",
        error: error.message,
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

      res.status(200).json({
        user,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
