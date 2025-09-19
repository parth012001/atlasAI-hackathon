import OpenAI from 'openai';
import type { TravelRequest, TravelPlan } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTravelPlan(request: TravelRequest): Promise<TravelPlan> {
  const prompt = `
    Generate a detailed 7-day travel plan for:
    - Destination: ${request.destination}
    - Duration: ${request.duration} days
    - Purpose: ${request.purpose}
    - Budget: ${request.budget}
    
    Return a JSON object with this EXACT structure:
    {
      "id": "unique-id",
      "destination": "${request.destination}",
      "duration": ${request.duration},
      "outboundFlight": {
        "id": "flight-out-1",
        "airline": "Example Airlines",
        "departure": {"airport": "JFK", "time": "14:30", "date": "2024-03-15"},
        "arrival": {"airport": "CDG", "time": "08:15", "date": "2024-03-16"},
        "price": 650,
        "bookingUrl": "https://example.com/book"
      },
      "returnFlight": {
        "id": "flight-ret-1", 
        "airline": "Example Airlines",
        "departure": {"airport": "CDG", "time": "11:20", "date": "2024-03-22"},
        "arrival": {"airport": "JFK", "time": "15:45", "date": "2024-03-22"},
        "price": 650,
        "bookingUrl": "https://example.com/book"
      },
      "hotel": {
        "id": "hotel-1",
        "name": "Example Hotel",
        "address": "123 Example Street",
        "rating": 4.5,
        "pricePerNight": 200,
        "checkIn": "2024-03-16",
        "checkOut": "2024-03-22",
        "bookingUrl": "https://example.com/book",
        "amenities": ["WiFi", "Breakfast", "Gym"]
      },
      "itinerary": [
        {
          "date": "2024-03-16",
          "activities": [
            {
              "id": "act-1",
              "name": "Airport Transfer",
              "description": "Travel from airport to hotel",
              "location": "CDG to Hotel",
              "duration": "1 hour",
              "category": "transport",
              "timeSlot": "morning"
            },
            {
              "id": "act-2",
              "name": "Business Meeting",
              "description": "Client presentation",
              "location": "Business District",
              "duration": "2 hours",
              "category": "business",
              "timeSlot": "afternoon"
            }
          ]
        },
        {
          "date": "2024-03-17",
          "activities": [
            {
              "id": "act-3",
              "name": "Museum Visit",
              "description": "Explore local art",
              "location": "City Center",
              "duration": "3 hours",
              "category": "leisure",
              "timeSlot": "morning"
            }
          ]
        }
      ],
      "totalCost": 2500,
      "calendarEvents": [
        {
          "title": "Flight to ${request.destination}",
          "start": "2024-03-15T14:30:00",
          "end": "2024-03-16T08:15:00",
          "location": "JFK Airport"
        }
      ]
    }
    
    Requirements:
    - Generate EXACTLY ${request.duration || 7} days in the itinerary array
    - Create realistic activities for morning/afternoon/evening time slots for EACH day
    - Include one "surprise" activity marked with category: "surprise"
    - Balance business and leisure based on purpose: ${request.purpose}
    - Use realistic prices and locations for ${request.destination}
    - Ensure activities flow logically day by day
    - IMPORTANT: The itinerary array must contain ${request.duration || 7} objects, one for each day
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  try {
    const plan = JSON.parse(response.choices[0].message.content || '{}');
    return plan;
  } catch (error) {
    console.error('Failed to parse travel plan:', error);
    throw new Error('Failed to generate travel plan');
  }
}

export async function parseNaturalLanguageRequest(description: string): Promise<TravelRequest> {
  const prompt = `
    Parse this travel request and extract key information:
    "${description}"
    
    Return a JSON object with:
    - destination: string (extract the main destination city/country, e.g., "Paris", "Tokyo", "London")
    - destinationCode: string (3-letter airport code for the destination, e.g., "CDG" for Paris, "NRT" for Tokyo)
    - duration: number (days, if not specified assume 7)
    - purpose: 'business' | 'leisure' | 'mixed' (infer from context)
    - budget: 'budget' | 'mid-range' | 'luxury' (infer from context)
    
    Examples:
    "Paris for work and fun" → {"destination": "Paris", "destinationCode": "CDG", "purpose": "mixed"}
    "Tokyo cultural experience" → {"destination": "Tokyo", "destinationCode": "NRT", "purpose": "leisure"}
    "London business meetings" → {"destination": "London", "destinationCode": "LHR", "purpose": "business"}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    return {
      description,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return { description };
  }
}

export async function fetchFlightData(travelData: any): Promise<any> {
  const apifyInput = {
    "origin.0": "San Francisco", // Use city name not airport code
    "target.0": travelData.destination || "Paris", // Use destination city name
    "depart.0": "TOMORROW" // Use relative date format for now
  };

  console.log('Apify Input:', apifyInput);

  try {
    // Add a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await fetch(`https://api.apify.com/v2/acts/jupri~skyscanner-flight/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apifyInput),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const flightData = await response.json();
    console.log('Apify Response:', flightData);
    
    return flightData;
  } catch (error) {
    console.error('Failed to fetch flight data from Apify:', error);
    throw new Error('Failed to fetch real flight data');
  }
}