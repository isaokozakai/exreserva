'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toursAPI, reservationsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateReservationRequest } from '@/types';

const BookTourPage = () => {
  const params = useParams();
  const tourId = params.tourId as string;
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateReservationRequest>();

  // Fetch tour details
  const { data: tourData, isLoading: tourLoading, isError: tourError, error: tourFetchError } = useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => toursAPI.getById(tourId),
    enabled: !!tourId,
  });

  const tour = tourData?.data?.tour;

  // Mutation for creating a reservation
  const createReservationMutation = useMutation({
    mutationFn: (data: CreateReservationRequest) => reservationsAPI.create(data),
    onSuccess: () => {
      toast.success('Tour booked successfully!');
      router.push('/reservations'); // Redirect to user's reservations
    },
    onError: (error: any) => {
      toast.error(`Error booking tour: ${error?.response?.data?.message || error.message || 'Unknown error'}`);
    },
  });

  const onSubmit = (data: CreateReservationRequest) => {
    if (!token) {
      toast.error('You must be logged in to book a tour.');
      router.push('/auth/login');
      return;
    }
    if (!tour) {
      toast.error('Tour details not loaded. Please try again.');
      return;
    }

    const reservationData = {
      ...data,
      tourId: tour.id,
      guests: Number(data.guests), // Ensure guests is a number
    };
    createReservationMutation.mutate(reservationData);
  };

  if (authLoading || tourLoading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to book a tour.</p>
        <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    );
  }

  if (tourError) {
    toast.error(`Error loading tour: ${tourFetchError?.message || 'Unknown error'}`);
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {tourFetchError?.message || 'Failed to load tour details'}</div>;
  }

  if (!tour) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <p>The tour you are trying to book does not exist or has been removed.</p>
        <Link href="/tours" className="text-blue-500 hover:underline mt-4 inline-block">Back to Tours</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Book Tour: {tour.title}</h1>
        <p className="text-center text-gray-600 mb-6">Location: {tour.location} | Price: ${tour.price.toFixed(2)}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Preferred Date</label>
            <input
              type="date"
              id="date"
              {...register('date', { required: 'Date is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.date && <p className="text-red-500 text-xs italic">{errors.date.message}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="guests" className="block text-gray-700 text-sm font-bold mb-2">Number of Guests</label>
            <input
              type="number"
              id="guests"
              {...register('guests', {
                required: 'Number of guests is required',
                min: { value: 1, message: 'Must be at least 1 guest' },
                max: { value: tour.maxCapacity, message: `Cannot exceed tour max capacity (${tour.maxCapacity})` },
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.guests && <p className="text-red-500 text-xs italic">{errors.guests.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={createReservationMutation.isPending}
            >
              {createReservationMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </button>
            <Link href={`/tours/${tour.id}`} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookTourPage;
