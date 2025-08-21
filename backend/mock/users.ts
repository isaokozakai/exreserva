import { User } from "../src/types";

export const mockUsers: Omit<User, "createdAt" | "updatedAt">[] = [
  {
    id: "user1",
    email: "jean@paristours.com",
    name: "Jean Dupont",
  },
  {
    id: "user2",
    email: "yuki@japantours.com",
    name: "Yuki Tanaka",
  },
];

export const mockUserCredentials = [
  {
    id: "user1",
    email: "jean@paristours.com",
    password: "password123", // In real app, this would be hashed
    name: "Jean Dupont",
  },
  {
    id: "user2",
    email: "yuki@japantours.com",
    password: "password123", // In real app, this would be hashed
    name: "Yuki Tanaka",
  },
];

export const generateMockUsers = (): User[] => {
  return mockUsers.map((user) => ({
    ...user,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    updatedAt: new Date(),
  }));
};
