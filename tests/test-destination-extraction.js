// Test file for destination extraction
// Run with: node tests/test-destination-extraction.js

require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env.local file');
  console.log('💡 Make sure you have OPENAI_API_KEY=your_key_here in .env.local');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testDestinationExtraction(description) {
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

  try {
    console.log(`\n🧪 Testing: "${description}"`);
    console.log('📤 Sending to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    console.log('📥 Raw OpenAI Response:', response.choices[0].message.content);
    
    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    
    console.log('✅ Parsed Result:');
    console.log('   Destination:', parsed.destination);
    console.log('   Airport Code:', parsed.destinationCode);
    console.log('   Purpose:', parsed.purpose);
    console.log('   Duration:', parsed.duration);
    console.log('   Budget:', parsed.budget);
    
    return parsed;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Destination Extraction...\n');
  
  const testCases = [
    "I want to visit Paris for a week mixing business and pleasure",
    "Planning a trip to Tokyo for cultural experiences", 
    "Need to go to London for meetings and sightseeing",
    "Vacation in Bali for relaxation and beaches",
    "Business trip to New York for conferences"
  ];

  for (const testCase of testCases) {
    await testDestinationExtraction(testCase);
    console.log('─'.repeat(60));
  }
}

runTests().catch(console.error);