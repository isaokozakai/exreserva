import { Request, Response } from "express";
import { TourService } from "../services/tourService";
import { CreateTourRequest, UpdateTourRequest } from "../types";

const tourService = new TourService();

export class TourController {
  async getAllTours(req: Request, res: Response) {
    try {
      const tours = await tourService.getAllTours();

      res.status(200).json({
        tours,
        count: tours.length,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getTourById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tour = await tourService.getTourById(id);

      if (!tour) {
        return res.status(404).json({
          message: "Tour not found",
        });
      }

      res.status(200).json({
        tour,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async createTour(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const tourData: CreateTourRequest = req.body;

      // Validate required fields
      if (
        !tourData.title ||
        !tourData.description ||
        !tourData.price ||
        !tourData.location ||
        !tourData.duration ||
        !tourData.maxCapacity
      ) {
        return res.status(400).json({
          message:
            "Title, description, price, location, duration, and maxCapacity are required",
        });
      }

      // Validate price
      if (tourData.price <= 0) {
        return res.status(400).json({
          message: "Price must be greater than 0",
        });
      }

      // Validate duration
      if (tourData.duration <= 0) {
        return res.status(400).json({
          message: "Duration must be greater than 0",
        });
      }

      // Validate maxCapacity
      if (tourData.maxCapacity <= 0) {
        return res.status(400).json({
          message: "Max capacity must be greater than 0",
        });
      }

      const tour = await tourService.createTour(tourData, req.user.userId);

      res.status(201).json({
        message: "Tour created successfully",
        tour,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateTour(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { id } = req.params;
      const tourData: UpdateTourRequest = req.body;

      // Validate price if provided
      if (tourData.price !== undefined && tourData.price <= 0) {
        return res.status(400).json({
          message: "Price must be greater than 0",
        });
      }

      // Validate duration if provided
      if (tourData.duration !== undefined && tourData.duration <= 0) {
        return res.status(400).json({
          message: "Duration must be greater than 0",
        });
      }

      // Validate maxCapacity if provided
      if (tourData.maxCapacity !== undefined && tourData.maxCapacity <= 0) {
        return res.status(400).json({
          message: "Max capacity must be greater than 0",
        });
      }

      const tour = await tourService.updateTour(id, tourData, req.user.userId);

      res.status(200).json({
        message: "Tour updated successfully",
        tour,
      });
    } catch (error: any) {
      if (error.message === "Tour not found") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async deleteTour(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const { id } = req.params;

      await tourService.deleteTour(id, req.user.userId);

      res.status(200).json({
        message: "Tour deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Tour not found") {
        return res.status(404).json({
          message: error.message,
        });
      }

      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getToursByCreator(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const tours = await tourService.getToursByCreator(req.user.userId);

      res.status(200).json({
        tours,
        count: tours.length,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
