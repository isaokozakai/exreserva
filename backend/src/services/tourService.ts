import { PrismaClient } from "@prisma/client";
import { CreateTourRequest, UpdateTourRequest, Tour } from "../types";

const prisma = new PrismaClient();

export class TourService {
  async getAllTours(): Promise<Tour[]> {
    return prisma.tour.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTourById(id: string): Promise<Tour | null> {
    return prisma.tour.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async createTour(
    tourData: CreateTourRequest,
    creatorId: string
  ): Promise<Tour> {
    return prisma.tour.create({
      data: {
        ...tourData,
        creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateTour(
    id: string,
    tourData: UpdateTourRequest,
    userId: string
  ): Promise<Tour> {
    // Check if user owns the tour
    const existingTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!existingTour) {
      throw new Error("Tour not found");
    }

    if (existingTour.creatorId !== userId) {
      throw new Error("Unauthorized: You can only update your own tours");
    }

    return prisma.tour.update({
      where: { id },
      data: tourData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteTour(id: string, userId: string): Promise<void> {
    // Check if user owns the tour
    const existingTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!existingTour) {
      throw new Error("Tour not found");
    }

    if (existingTour.creatorId !== userId) {
      throw new Error("Unauthorized: You can only delete your own tours");
    }

    await prisma.tour.delete({
      where: { id },
    });
  }

  async getToursByCreator(creatorId: string): Promise<Tour[]> {
    return prisma.tour.findMany({
      where: { creatorId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
