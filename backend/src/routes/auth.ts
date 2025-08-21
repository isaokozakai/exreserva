import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
