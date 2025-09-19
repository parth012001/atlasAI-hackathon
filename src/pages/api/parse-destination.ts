import { NextApiRequest, NextApiResponse } from 'next';
import { parseNaturalLanguageRequest } from '@/lib/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, travelData } = req.body;
    
    if (!request) {
      return res.status(400).json({ error: 'Travel request is required' });
    }

    console.log('🎯 Parsing destination from:', request);
    const parsedRequest = await parseNaturalLanguageRequest(request);
    
    if (!parsedRequest.destination) {
      return res.status(400).json({ error: 'Please specify a destination in your travel request' });
    }

    // Combine parsed data with form data
    const combinedData = {
      ...parsedRequest,
      ...travelData, // Form data overrides parsed data
    };

    console.log('✅ Destination parsed:', combinedData);
    res.status(200).json(combinedData);
    
  } catch (error) {
    console.error('❌ Error parsing destination:', error);
    res.status(500).json({ error: 'Failed to parse destination' });
  }
}