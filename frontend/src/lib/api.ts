import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  AuthResponse,
  CreateReservationRequest,
  CreateTourRequest,
  LoginRequest,
  Tour,
  Reservation,
} from "@/types";
import { toast } from "react-hot-toast";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("Access denied");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>("/auth/signup", data),
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
};

export const toursAPI = {
  getAll: () => api.get<{ tours: Tour[]; count: number }>("/tours"),
  getById: (id: string) => api.get<{ tour: Tour }>(`/tours/${id}`),
  create: (data: CreateTourRequest) => api.post<{ tour: Tour }>("/tours", data),
  update: (id: string, data: Partial<CreateTourRequest>) =>
    api.put<{ tour: Tour }>(`/tours/${id}`, data),
  delete: (id: string) => api.delete(`/tours/${id}`),
  getByCreator: () => api.get("/tours/creator/my-tours"),
};

export const reservationsAPI = {
  create: (data: CreateReservationRequest) => api.post("/reservations", data),
  getUserReservations: () =>
    api.get<{ reservations: Reservation[]; count: number }>("/reservations"),
  getById: (id: string) =>
    api.get<{ reservation: Reservation }>(`/reservations/${id}`),
  cancel: (id: string) =>
    api.put<{ reservation: Reservation }>(`/reservations/${id}/cancel`),
  updateStatus: (id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") =>
    api.put<{ reservation: Reservation }>(`/reservations/${id}/status`, {
      status,
    }),
};

export default api;
