import { Router } from "express";
import { TourController } from "../controllers/tour-controller";
import { authenticateToken, requireAuth } from "../middleware/auth";

const router = Router();
const tourController = new TourController();

// Public routes
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);

// Protected routes
router.post("/", authenticateToken, requireAuth, tourController.createTour);
router.put("/:id", authenticateToken, requireAuth, tourController.updateTour);
router.delete(
  "/:id",
  authenticateToken,
  requireAuth,
  tourController.deleteTour
);
router.get(
  "/creator/my-tours",
  authenticateToken,
  requireAuth,
  tourController.getToursByCreator
);

export default router;
