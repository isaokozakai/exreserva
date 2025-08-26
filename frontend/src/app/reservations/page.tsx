'use client';

import { useQuery } from '@tanstack/react-query';
import { reservationsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const ReservationsPage = () => {
  const { token, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userReservations', token],
    queryFn: () => reservationsAPI.getUserReservations(),
    enabled: !!token && !authLoading, // Only run query if token is available and auth is not loading
  });

  if (authLoading) {
    return <div className="container mx-auto p-4 text-center">Loading authentication...</div>;
  }

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your reservations.</p>
        <Link href="/auth/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading reservations...</div>;
  }

  if (isError) {
    toast.error(`Error loading reservations: ${error?.message || 'Unknown error'}`);
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error?.message || 'Failed to load reservations'}</div>;
  }

  const reservations = data?.data?.reservations || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-lg text-gray-700 mb-4">You don't have any reservations yet.</p>
          <Link href="/tours" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">{reservation.tour.title}</h2>
              <p className="text-gray-600 mb-1"><strong>Location:</strong> {reservation.tour.location}</p>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-1"><strong>Guests:</strong> {reservation.guests}</p>
              <p className="text-gray-600 mb-1"><strong>Total Price:</strong> ${reservation.totalPrice.toFixed(2)}</p>
              <p className={`font-semibold mt-2 ${
                reservation.status === 'CONFIRMED' ? 'text-green-600' :
                reservation.status === 'PENDING' ? 'text-yellow-600' :
                'text-red-600'
              }`}>Status: {reservation.status}</p>
              <Link href={`/tours/${reservation.tourId}`} className="text-blue-500 hover:underline mt-4 inline-block">
                View Tour Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;