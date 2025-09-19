import { NextApiRequest, NextApiResponse } from 'next';
import { generateTravelPlan } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { parsed, flights, travelData } = req.body;
    
    console.log('🗓️ Generating full travel plan for:', parsed.destination);
    
    // Combine all data for plan generation
    const enrichedTravelData = {
      ...parsed,
      ...travelData,
      realFlightData: flights
    };

    const travelPlan = await generateTravelPlan(enrichedTravelData);
    
    // If we have real flight data, incorporate the best price
    if (Array.isArray(flights) && flights.length > 0) {
      const bestFlight = flights[0];
      
      // Handle both object and number price formats
      const flightPrice = bestFlight.cheapest_price?.amount || bestFlight.cheapest_price || 650;
      
      travelPlan.outboundFlight.price = flightPrice;
      travelPlan.returnFlight.price = flightPrice;
      
      // Update total cost with proper number conversion
      const hotelBudget = parseInt(travelData.hotelBudget) || 200;
      const duration = parseInt(travelData.duration) || 7;
      
      travelPlan.totalCost = Math.round(
        (flightPrice * 2) + // Round trip flights
        (hotelBudget * duration) + // Hotel costs
        500 // Activities estimate
      );
      
      console.log('💰 Cost calculation:', {
        flightPrice,
        hotelBudget,
        duration,
        totalCost: travelPlan.totalCost
      });
    }

    console.log('✅ Travel plan generated:', {
      destination: travelPlan.destination,
      days: travelPlan.itinerary?.length,
      totalCost: travelPlan.totalCost
    });
    
    res.status(200).json(travelPlan);
    
  } catch (error) {
    console.error('❌ Error generating travel plan:', error);
    res.status(500).json({ error: 'Failed to generate travel plan' });
  }
}