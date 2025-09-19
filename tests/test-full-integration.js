// Full integration test simulating the API endpoint
// Run with: node tests/test-full-integration.js

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testFullIntegration() {
  console.log('🚀 Testing Full Integration (API Endpoint Simulation)...\n');

  const testData = {
    request: "I want to visit Paris for a week mixing business and pleasure",
    travelData: {
      description: "I want to visit Paris for a week mixing business and pleasure",
      departureDate: "2024-12-15",
      returnDate: "2024-12-22", 
      flightBudget: "1000",
      hotelBudget: "200"
    }
  };

  console.log('📤 Test Input:', JSON.stringify(testData, null, 2));

  try {
    console.log('\n🔄 Calling our API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      timeout: 180000 // 3 minutes timeout
    });

    console.log('📊 Response Status:', response.status);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('\n✅ API Response Success!');
      console.log('📋 Response Structure:');
      console.log('   Success:', responseData.success);
      console.log('   Has Travel Plan:', !!responseData.travelPlan);
      console.log('   Has Flight Data:', !!responseData.flightData);
      console.log('   Has Parsed Request:', !!responseData.parsedRequest);
      
      if (responseData.parsedRequest) {
        console.log('\n🎯 Parsed Request Data:');
        console.log('   Destination:', responseData.parsedRequest.destination);
        console.log('   Destination Code:', responseData.parsedRequest.destinationCode);
        console.log('   Purpose:', responseData.parsedRequest.purpose);
        console.log('   Departure Date:', responseData.parsedRequest.departureDate);
        console.log('   Return Date:', responseData.parsedRequest.returnDate);
      }
      
      if (responseData.flightData) {
        console.log('\n✈️ Flight Data:');
        if (Array.isArray(responseData.flightData)) {
          console.log('   Flight Results Count:', responseData.flightData.length);
          if (responseData.flightData.length > 0) {
            console.log('   Sample Flight:', JSON.stringify(responseData.flightData[0], null, 2).substring(0, 300) + '...');
          }
        } else {
          console.log('   Flight Data Type:', typeof responseData.flightData);
          console.log('   Flight Data:', JSON.stringify(responseData.flightData, null, 2).substring(0, 500) + '...');
        }
      } else {
        console.log('\n⚠️ No flight data returned (likely using mock data)');
      }
      
      if (responseData.travelPlan) {
        console.log('\n🗺️ Travel Plan Generated:');
        console.log('   Destination:', responseData.travelPlan.destination);
        console.log('   Duration:', responseData.travelPlan.duration);
        console.log('   Days in Itinerary:', responseData.travelPlan.itinerary?.length);
        console.log('   Total Cost:', responseData.travelPlan.totalCost);
      }
      
    } else {
      console.error('\n❌ API Error:', responseData);
    }
    
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure your Next.js server is running with `npm run dev`');
    }
  }
}

async function testWithDifferentDestinations() {
  console.log('\n🌍 Testing Multiple Destinations...\n');
  
  const destinations = [
    "I want to explore Tokyo for cultural experiences",
    "Business trip to London with some sightseeing",
    "Vacation in Bali for relaxation and beaches"
  ];

  for (const destination of destinations) {
    console.log(`\n🧪 Testing: "${destination}"`);
    
    const testData = {
      request: destination,
      travelData: {
        description: destination,
        departureDate: "2024-12-15",
        returnDate: "2024-12-22",
        flightBudget: "1200",
        hotelBudget: "150"
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.parsedRequest) {
        console.log('   ✅ Extracted:', responseData.parsedRequest.destination, '→', responseData.parsedRequest.destinationCode);
      } else {
        console.log('   ❌ Failed extraction');
      }
      
    } catch (error) {
      console.log('   ❌ Request failed:', error.message);
    }
  }
}

async function runAllTests() {
  await testFullIntegration();
  await testWithDifferentDestinations();
}

runAllTests().catch(console.error);