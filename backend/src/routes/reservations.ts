import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { authenticateToken, requireAuth } from "../middleware/auth";

const router = Router();
const reservationController = new ReservationController();

// All reservation routes require authentication
router.use(authenticateToken);
router.use(requireAuth);

router.post("/", reservationController.createReservation);
router.get("/", reservationController.getUserReservations);
router.get("/:id", reservationController.getReservationById);
router.put("/:id/cancel", reservationController.cancelReservation);
router.put("/:id/status", reservationController.updateReservationStatus);

export default router;
