"use client";

import { useForm } from "react-hook-form";
import { toursAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CreateTourRequest } from "@/types";

const CreateTourPage = () => {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTourRequest>();

  const createTourMutation = useMutation({
    mutationFn: (data: CreateTourRequest) => toursAPI.create(data),
    onSuccess: () => {
      toast.success("Tour created successfully!");
      reset(); // Clear form fields
      router.push("/tours"); // Redirect to tours list or tour details page
    },
    onError: (error: any) => {
      toast.error(
        `Error creating tour: ${
          error?.response?.data?.message || error.message || "Unknown error"
        }`
      );
    },
  });

  const onSubmit = (data: CreateTourRequest) => {
    if (!token) {
      toast.error("You must be logged in to create a tour.");
      router.push("/auth/login");
      return;
    }

    const input = {
      ...data,
      price: Number(data.price),
      duration: Number(data.duration),
      maxCapacity: Number(data.maxCapacity),
    };

    createTourMutation.mutate(input);
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading authentication...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to create a tour.</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="text-blue-500 hover:underline mt-2"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Tour</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs italic">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.price && (
            <p className="text-red-500 text-xs italic">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register("location", { required: "Location is required" })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.location && (
            <p className="text-red-500 text-xs italic">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL (Optional)
          </label>
          <input
            type="text"
            id="imageUrl"
            {...register("imageUrl")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Duration (in hours)
          </label>
          <input
            type="number"
            id="duration"
            {...register("duration", {
              required: "Duration is required",
              min: { value: 1, message: "Duration must be at least 1 hour" },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.duration && (
            <p className="text-red-500 text-xs italic">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="maxCapacity"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Max Capacity
          </label>
          <input
            type="number"
            id="maxCapacity"
            {...register("maxCapacity", {
              required: "Max Capacity is required",
              min: { value: 1, message: "Max Capacity must be at least 1" },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.maxCapacity && (
            <p className="text-red-500 text-xs italic">
              {errors.maxCapacity.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={createTourMutation.isPending}
          >
            {createTourMutation.isPending ? "Creating..." : "Create Tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTourPage;
