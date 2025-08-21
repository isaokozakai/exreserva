import { PrismaClient } from "@prisma/client";
import { CreateReservationRequest, Reservation } from "../types";

const prisma = new PrismaClient();

export class ReservationService {
  async createReservation(
    reservationData: CreateReservationRequest,
    userId: string
  ): Promise<Reservation> {
    const { tourId, date, guests } = reservationData;

    // Check if tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      throw new Error("Tour not found");
    }

    // Check if tour has capacity
    if (guests > tour.maxCapacity) {
      throw new Error(`Tour can only accommodate ${tour.maxCapacity} guests`);
    }

    // Calculate total price
    const totalPrice = tour.price * guests;

    // Check if date is in the future
    const reservationDate = new Date(date);
    if (reservationDate <= new Date()) {
      throw new Error("Reservation date must be in the future");
    }

    // Check if user already has a reservation for this tour on this date
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tourId,
        userId,
        date: reservationDate,
      },
    });

    if (existingReservation) {
      throw new Error(
        "You already have a reservation for this tour on this date"
      );
    }

    return prisma.reservation.create({
      data: {
        tourId,
        userId,
        date: reservationDate,
        guests,
        totalPrice,
      },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async getReservationById(
    id: string,
    userId: string
  ): Promise<Reservation | null> {
    return prisma.reservation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async cancelReservation(id: string, userId: string): Promise<Reservation> {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (
      reservation.status !== "PENDING" &&
      reservation.status !== "CONFIRMED"
    ) {
      throw new Error("Cannot cancel this reservation");
    }

    return prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateReservationStatus(
    id: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ): Promise<Reservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    return prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        tour: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
