// Test file for Apify Skyscanner integration
// Run with: node tests/test-apify-integration.js

const fetch = require('node-fetch');

async function testApifyIntegration() {
  console.log('🚀 Testing Apify Skyscanner Integration...\n');

  // Test data - trying different formats
  const testCases = [
    {
      name: "SFO to Paris (Format 1)",
      input: {
        "origin.0": "SFO",
        "target.0": "CDG", 
        "depart.0": "2024-12-15",
        "return.0": "2024-12-22"
      }
    },
    {
      name: "SFO to Paris (Format 2)",
      input: {
        "origin.0": "San Francisco",
        "target.0": "Paris",
        "depart.0": "TOMORROW"
      }
    },
    {
      name: "SFO to Paris (Format 3)",
      input: {
        "from": "SFO",
        "to": "CDG",
        "departure": "2024-12-15",
        "return": "2024-12-22"
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('📤 Input Data:', JSON.stringify(testCase.input, null, 2));
    
    try {
      console.log('🔄 Calling Apify API...');
      
      const response = await fetch(
        `https://api.apify.com/v2/acts/jupri~skyscanner-flight/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testCase.input),
        }
      );

      console.log('📊 Response Status:', response.status);
      console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        continue;
      }

      const data = await response.json();
      
      console.log('✅ Success! Response Type:', typeof data);
      console.log('✅ Response Keys:', Object.keys(data));
      
      if (Array.isArray(data)) {
        console.log('✅ Flight Results Count:', data.length);
        if (data.length > 0) {
          console.log('✅ Sample Flight Data:');
          console.log('   First Result Keys:', Object.keys(data[0]));
          console.log('   Sample Data:', JSON.stringify(data[0], null, 2).substring(0, 500) + '...');
        }
      } else {
        console.log('✅ Full Response:', JSON.stringify(data, null, 2).substring(0, 1000) + '...');
      }
      
    } catch (error) {
      console.error('❌ Network/Parse Error:', error.message);
      console.error('❌ Full Error:', error);
    }
    
    console.log('─'.repeat(80));
  }
}

// Also test the Actor info endpoint
async function testActorInfo() {
  console.log('\n🔍 Testing Actor Information...\n');
  
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/jupri~skyscanner-flight?token=${process.env.APIFY_API_TOKEN}`
    );
    
    const actorInfo = await response.json();
    console.log('📋 Actor Info:');
    console.log('   Name:', actorInfo.name);
    console.log('   Version:', actorInfo.defaultRunOptions?.build);
    console.log('   Status:', actorInfo.stats?.isActive ? 'Active' : 'Inactive');
    console.log('   Last Modified:', actorInfo.modifiedAt);
    
  } catch (error) {
    console.error('❌ Failed to get actor info:', error.message);
  }
}

async function runTests() {
  await testActorInfo();
  await testApifyIntegration();
}

runTests().catch(console.error);