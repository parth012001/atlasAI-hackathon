export interface TravelRequest {
  description: string;
  destination?: string;
  duration?: number;
  purpose?: 'business' | 'leisure' | 'mixed';
  budget?: 'budget' | 'mid-range' | 'luxury';
}

export interface Flight {
  id: string;
  airline: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  price: number;
  bookingUrl: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  bookingUrl: string;
  amenities: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  price?: number;
  bookingUrl?: string;
  category: 'business' | 'leisure' | 'dining' | 'transport' | 'surprise';
  timeSlot: string;
}

export interface DayItinerary {
  date: string;
  activities: Activity[];
}

export interface TravelPlan {
  id: string;
  destination: string;
  duration: number;
  outboundFlight: Flight;
  returnFlight: Flight;
  hotel: Hotel;
  itinerary: DayItinerary[];
  totalCost: number;
  calendarEvents: CalendarEvent[];
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}