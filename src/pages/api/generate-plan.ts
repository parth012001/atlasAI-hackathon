import { NextApiRequest, NextApiResponse } from 'next';
import { parseNaturalLanguageRequest, generateTravelPlan, fetchFlightData } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, travelData } = req.body;
    
    if (!request) {
      return res.status(400).json({ error: 'Travel request is required' });
    }

    console.log('Step 1: Parsing natural language request...');
    const parsedRequest = await parseNaturalLanguageRequest(request);
    
    if (!parsedRequest.destination) {
      return res.status(400).json({ error: 'Please specify a destination in your travel request' });
    }

    console.log('Parsed Request:', parsedRequest);

    // Combine parsed data with form data
    const combinedTravelData = {
      ...parsedRequest,
      ...travelData, // Form data (dates, budgets) overrides parsed data
    };

    console.log('Step 2: Fetching real flight data...');
    let flightData = null;
    try {
      flightData = await fetchFlightData(combinedTravelData);
      console.log('Flight data fetched successfully');
    } catch (flightError) {
      console.warn('Failed to fetch flight data, continuing with mock data:', flightError);
    }

    console.log('Step 3: Generating travel plan...');
    const travelPlan = await generateTravelPlan(combinedTravelData);
    
    res.status(200).json({ 
      success: true, 
      travelPlan,
      flightData,
      parsedRequest: combinedTravelData
    });
  } catch (error) {
    console.error('Error generating travel plan:', error);
    res.status(500).json({ error: 'Failed to generate travel plan' });
  }
}