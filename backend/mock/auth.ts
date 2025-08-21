import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { mockUserCredentials } from "./users";
import {
  User,
  CreateUserRequest,
  LoginRequest,
  AuthResponse,
} from "../src/types";

export class MockAuthService {
  private users: Array<{
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }> = mockUserCredentials.map((user) => ({
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  async signup(userData: CreateUserRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = this.users.find(
      (user) => user.email === userData.email
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser: User = {
      id: `user${this.users.length + 1}`,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Hash password and store credentials
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    this.users.push({
      ...newUser,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(newUser.id, newUser.email);

    return { user: newUser, token };
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = this.users.find((u) => u.email === loginData.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    // Return user without password, ensuring all required properties are present
    const { password: _, ...userWithoutPassword } = user;
    const userWithDates: User = {
      ...userWithoutPassword,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };

    return { user: userWithDates, token };
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || "mock-secret-key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    return jwt.sign({ userId, email }, secret, { expiresIn } as SignOptions);
  }

  // Mock data for testing
  getMockUsers() {
    return this.users.map(({ password: _, ...user }) => user);
  }

  // Reset mock data
  resetMockData() {
    this.users = mockUserCredentials.map((user) => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();
