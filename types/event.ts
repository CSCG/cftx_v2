export interface Event {
      id: string;
      event_name: string;
      event_description: string;
      event_date: string;
      venue_address: string;
      banner_image_url: string;
    }

    export interface CreateEventInput {
      event_name: string;
      event_description: string;
      event_date: string;
      venue_address: string;
      price: number;
      capacity: number;
      banner_image_url: string;
      category: string;
    }
