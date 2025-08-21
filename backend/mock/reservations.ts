import { Reservation } from "../src/types";

export const mockReservations: Omit<
  Reservation,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    tourId: "tour1",
    userId: "user1",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    guests: 2,
    totalPrice: 179.98,
    status: "CONFIRMED",
    tour: {
      id: "tour1",
      title: "Paris City Explorer",
      description:
        "Discover the magic of Paris with our comprehensive city tour.",
      price: 89.99,
      location: "Paris, France",
      imageUrl:
        "https://images.unsplash.com/photo-1502602898534-8610c9d4a8a3?w=800",
      duration: 8,
      maxCapacity: 20,
      creatorId: "user1",
      creator: {
        id: "user1",
        name: "Jean Dupont",
        email: "jean@paristours.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    user: {
      id: "user1",
      name: "Jean Dupont",
      email: "jean@paristours.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    tourId: "tour2",
    userId: "user2",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    guests: 1,
    totalPrice: 129.99,
    status: "PENDING",
    tour: {
      id: "tour2",
      title: "Tokyo Cultural Immersion",
      description:
        "Immerse yourself in Japanese culture with visits to ancient temples.",
      price: 129.99,
      location: "Tokyo, Japan",
      imageUrl:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      duration: 10,
      maxCapacity: 15,
      creatorId: "user2",
      creator: {
        id: "user2",
        name: "Yuki Tanaka",
        email: "yuki@japantours.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    user: {
      id: "user2",
      name: "Yuki Tanaka",
      email: "yuki@japantours.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    tourId: "tour3",
    userId: "user1",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    guests: 4,
    totalPrice: 599.96,
    status: "PENDING",
    tour: {
      id: "tour3",
      title: "New York City Highlights",
      description:
        "Experience the Big Apple with visits to Times Square, Central Park.",
      price: 149.99,
      location: "New York City, USA",
      imageUrl:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      duration: 12,
      maxCapacity: 25,
      creatorId: "user1",
      creator: {
        id: "user1",
        name: "Jean Dupont",
        email: "jean@paristours.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    user: {
      id: "user1",
      name: "Jean Dupont",
      email: "jean@paristours.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export const generateMockReservations = (): Reservation[] => {
  return mockReservations.map((reservation, index) => ({
    ...reservation,
    id: `reservation${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
    updatedAt: new Date(),
  }));
};
