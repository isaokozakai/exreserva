'use client';

import { useQuery } from '@tanstack/react-query';
import { toursAPI } from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const TourDetailPage = () => {
  const params = useParams();
  const tourId = params.tourId as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => toursAPI.getById(tourId),
    enabled: !!tourId,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading tour details...</div>;
  }

  if (isError) {
    toast.error(`Error loading tour: ${error?.message || 'Unknown error'}`);
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error?.message || 'Failed to load tour'}</div>;
  }

  const tour = data?.data?.tour;

  if (!tour) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <p>The tour you are looking for does not exist or has been removed.</p>
        <Link href="/tours" className="text-blue-500 hover:underline mt-4 inline-block">Back to Tours</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {tour.imageUrl && (
          <img src={tour.imageUrl} alt={tour.title} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{tour.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{tour.location}</p>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Details</h2>
              <p className="text-gray-700"><strong>Price:</strong> ${tour.price.toFixed(2)}</p>
              <p className="text-gray-700"><strong>Duration:</strong> {tour.duration} days</p>
              <p className="text-gray-700"><strong>Max Capacity:</strong> {tour.maxCapacity} people</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Creator</h2>
              <p className="text-gray-700"><strong>Name:</strong> {tour.creator.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {tour.creator.email}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href={`/tours/${tour.id}/book`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
              Book This Tour
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <Link href="/tours" className="text-blue-500 hover:underline">Back to All Tours</Link>
      </div>
    </div>
  );
};

export default TourDetailPage;
