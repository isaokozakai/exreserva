import { Request, Response } from "express";
import { ReservationService } from "../services/reservation-service";
import { CreateReservationRequest } from "../types";

const reservationService = new ReservationService();

export class ReservationController {
  async createReservation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const reservationData: CreateReservationRequest = req.body;

      // Validate required fields
      if (
        !reservationData.tourId ||
        !reservationData.date ||
        !reservationData.guests
      ) {
        return res.status(400).json({
          message: "Tour ID, date, and number of guests are required",
        });
      }

      // Validate guests
      if (reservationData.guests <= 0) {
        return res.status(400).json({
          message: "Number of guests must be greater than 0",
        });
      }

      // Validate date format
      const date = new Date(reservationData.date);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid date format",
        });
      }

      const reservation = await reservationService.createReservation(
        reservationData,
        req.user.userId
      );

      return res.status(201).json({
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error: unknown) {
      if ((error as Error).message === "Tour not found") {
        return res.status(404).json({
          message: (error as Error).message,
        });
      }

      if ((error as Error).message.includes("can only accommodate")) {
        return res.status(400).json({
          message: (error as Error).message,
        });
      }

      if ((error as Error).message.includes("must be in the future")) {
        return res.status(400).json({
          message: (error as Error).message,
        });
      }

      if ((error as Error).message.includes("already have a reservation")) {
        return res.status(409).json({
          message: (error as Error).message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }

  async getUserReservations(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const reservations = await reservationService.getUserReservations(
        req.user.userId
      );

      return res.status(200).json({
        reservations,
        count: reservations.length,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }

  async getReservationById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { id } = req.params;

      const reservation = await reservationService.getReservationById(
        id,
        req.user.userId
      );

      if (!reservation) {
        return res.status(404).json({
          message: "Reservation not found",
        });
      }

      return res.status(200).json({
        reservation,
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }

  async cancelReservation(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { id } = req.params;

      const reservation = await reservationService.cancelReservation(
        id,
        req.user.userId
      );

      return res.status(200).json({
        message: "Reservation cancelled successfully",
        reservation,
      });
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      if (err.message === "Reservation not found") {
        return res.status(404).json({
          message: err.message,
        });
      }

      if (err.message.includes("Cannot cancel this reservation")) {
        return res.status(400).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  async updateReservationStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      if (
        !status ||
        !["CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Valid status is required (CONFIRMED, CANCELLED, or COMPLETED)",
        });
      }

      const reservation = await reservationService.updateReservationStatus(
        id,
        status
      );

      return res.status(200).json({
        message: "Reservation status updated successfully",
        reservation,
      });
    } catch (error: unknown) {
      const err = error as Error & { message: string };
      if (err.message === "Reservation not found") {
        return res.status(404).json({
          message: err.message,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}
