import { NextApiRequest, NextApiResponse } from 'next';
import { parseNaturalLanguageRequest, generateTravelPlan } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request } = req.body;
    
    if (!request) {
      return res.status(400).json({ error: 'Travel request is required' });
    }

    const parsedRequest = await parseNaturalLanguageRequest(request);
    
    if (!parsedRequest.destination) {
      return res.status(400).json({ error: 'Please specify a destination in your travel request' });
    }

    const travelPlan = await generateTravelPlan(parsedRequest);
    
    res.status(200).json({ success: true, travelPlan });
  } catch (error) {
    console.error('Error generating travel plan:', error);
    res.status(500).json({ error: 'Failed to generate travel plan' });
  }
}