import { api } from '@/lib/axios';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { TicketTier } from '@/types/ticket-tier';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react"; // For zoom icon

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    console.log('Fetching event with id:', id);
    const response = await api.post('/event-detail', {
      body: JSON.stringify({ id }),
    });
    console.log('Event response:', response);
    const parsed = JSON.parse(response.data.body);
    if (parsed && parsed[0]?.id) {
      return parsed[0];
    } else {
      console.error('Invalid event data:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return null;
  }
}

async function getTicketTiers(id: string): Promise<TicketTier[]> {
  try {
    console.log('Fetching ticket tiers with id:', id);
    const response = await api.post('/ticket-tiers', {
      body: JSON.stringify({ id }),
    });
    console.log('Ticket tiers response:', response);
    const parsed = JSON.parse(response.data.body);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.error('Invalid tier data:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch ticket tiers:', error);
    return [];
  }
}

function sanitizeHTML(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
    .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
    .replace(/<body\b[^<]*(?:(?!<\/body>)<[^<]*)*<\/body>/gi, '');
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = async ({ params }) => {
  const { id } = params;
  const event = await getEvent(id);
  const ticketTiers = await getTicketTiers(id);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Error: Event data is incomplete.
        </h1>
        <p className="text-gray-600">
          The event data is missing essential information. Please check the
          event ID and try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white-900 mb-4">
        {event.event_name}
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Image
          src={event.banner_image_url}
          alt={event.event_name}
          width={1280}
          height={400}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="mt-4">
          <div className="text-gray-700">
            <p className="text-gray-600">
              <span className="font-semibold">Date:</span>{' '}
              {format(new Date(event.event_date), 'PPP')}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Location:</span>{' '}
              {event.venue_address}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Price:</span>
            </p>
          </div>
        </div>
        {ticketTiers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-400 mb-4">
              Ticket Tiers
            </h2>
            <div className="space-y-4">
              {ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="border rounded-md p-4 flex flex-col gap-2"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {tier.tier_name}
                  </h3>
                  <p className="text-gray-600">{tier.tier_name}</p>
                  <p className="text-gray-700 font-medium">
                    Price: ${tier.tier_price}
                  </p>
                  <Button asChild>
                    <a href={`https://www.cedarfallsdata.com/event/${event.id}/${tier.id}/purchase`}>
                      Purchase Ticket
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML(event.event_description),
          }}
        />
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Flyer</h2>
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative group cursor-zoom-in">
                <Image
                  src={
                    event.banner_image_url ||
                    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'
                  }
                  alt={`${event.event_name} Flyer`}
                  width={800}
                  height={1200}
                  className="max-w-2xl rounded-lg shadow-md transition-transform group-hover:opacity-95"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 p-3 rounded-full">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={
                    event.banner_image_url ||
                    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'
                  }
                  alt={`${event.event_name} Flyer`}
                  width={1600}
                  height={2400}
                  className="max-w-full max-h-[80vh] object-contain"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
