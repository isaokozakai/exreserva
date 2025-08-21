export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  date: string;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  tour: Tour;
  user: User;
}

export interface CreateReservationRequest {
  tourId: string;
  date: string;
  guests: number;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface ToursResponse {
  tours: Tour[];
  count: number;
}

export interface ReservationsResponse {
  reservations: Reservation[];
  count: number;
}
