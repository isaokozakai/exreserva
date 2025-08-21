export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
  duration: number;
  maxCapacity: number;
  creatorId: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTourRequest {
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
  duration: number;
  maxCapacity: number;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {}

export interface Reservation {
  id: string;
  tourId: string;
  userId: string;
  date: Date;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
  tour: Tour;
  user: User;
}

export interface CreateReservationRequest {
  tourId: string;
  date: string;
  guests: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
