import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFlightData } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const travelData = req.body;
    
    console.log('✈️ Fetching flights for:', travelData.destination);
    
    let flightData = null;
    try {
      flightData = await fetchFlightData(travelData);
      console.log('✅ Flight data fetched:', Array.isArray(flightData) ? `${flightData.length} results` : 'No results');
    } catch (flightError) {
      console.warn('⚠️ Failed to fetch flight data, using mock data:', flightError.message);
      
      // Return mock flight data as fallback
      flightData = [{
        cheapest_price: 650,
        legs: [{
          departure_airport: 'SFO',
          arrival_airport: travelData.destinationCode,
          departure_time: '14:30',
          arrival_time: '08:15'
        }],
        pricing_options: [{
          price: 650,
          agent: 'Mock Airlines',
          booking_url: 'https://example.com/book'
        }]
      }];
    }

    res.status(200).json(flightData);
    
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
}