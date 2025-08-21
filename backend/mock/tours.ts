import { Tour } from "../src/types";

export const mockTours: Omit<Tour, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Paris City Explorer",
    description:
      "Discover the magic of Paris with our comprehensive city tour. Visit the Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and stroll along the Champs-Élysées. Experience the romance and culture of the City of Light.",
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
  },
  {
    title: "Tokyo Cultural Immersion",
    description:
      "Immerse yourself in Japanese culture with visits to ancient temples, traditional gardens, and modern districts. Experience tea ceremonies, sushi making, and the vibrant energy of Shibuya crossing.",
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
  },
  {
    title: "New York City Highlights",
    description:
      "Experience the Big Apple with visits to Times Square, Central Park, Statue of Liberty, and Empire State Building. Enjoy Broadway shows, world-class dining, and the city's iconic skyline.",
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
  },
  {
    title: "Santorini Sunset Adventure",
    description:
      "Explore the stunning Greek island of Santorini with its white-washed buildings, blue domes, and breathtaking sunsets. Visit Oia, Fira, and enjoy wine tasting at local vineyards.",
    price: 179.99,
    location: "Santorini, Greece",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    duration: 6,
    maxCapacity: 12,
    creatorId: "user2",
    creator: {
      id: "user2",
      name: "Yuki Tanaka",
      email: "yuki@japantours.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    title: "Machu Picchu Trek",
    description:
      "Embark on an unforgettable journey to the ancient Incan citadel. Trek through the Andes mountains, explore the Sacred Valley, and witness the sunrise over the mysterious ruins of Machu Picchu.",
    price: 299.99,
    location: "Cusco, Peru",
    imageUrl:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
    duration: 14,
    maxCapacity: 8,
    creatorId: "user1",
    creator: {
      id: "user1",
      name: "Jean Dupont",
      email: "jean@paristours.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export const generateMockTours = (): Tour[] => {
  return mockTours.map((tour, index) => ({
    ...tour,
    id: `tour${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    updatedAt: new Date(),
  }));
};
