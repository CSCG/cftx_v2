'use client';

import { Event } from '@/types/event';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Failed to fetch events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-md mb-4" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-red-600">{error}</h2>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">No events found</h2>
          <p className="text-gray-500 mt-2">Check back later for new events</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={
                  event.banner_image_url ||
                  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'
                }
                alt={event.event_name}
                width={640}
                height={360}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.event_name}
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(event.event_date), 'PPP')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue_address}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Ticket className="h-4 w-4 mr-2" />
                    $price TODO
                  </div>
                </div>
                <Link href={`/event-details/${event.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
