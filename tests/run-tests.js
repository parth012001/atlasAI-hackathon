// Simple test runner
// Run with: node tests/run-tests.js

const { spawn } = require('child_process');
const path = require('path');

function runTest(testFile, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🧪 ${description}`);
    console.log(`${'='.repeat(80)}`);
    
    const child = spawn('node', [testFile], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${description} completed successfully`);
        resolve();
      } else {
        console.log(`\n❌ ${description} failed with code ${code}`);
        reject(new Error(`Test failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.log(`\n❌ ${description} failed:`, error.message);
      reject(error);
    });
  });
}

async function runAllTests() {
  console.log('🚀 Running All Backend Tests...\n');
  
  const tests = [
    {
      file: 'tests/test-destination-extraction.js',
      description: 'Destination Extraction Test'
    },
    {
      file: 'tests/test-apify-integration.js', 
      description: 'Apify API Integration Test'
    },
    {
      file: 'tests/test-full-integration.js',
      description: 'Full Integration Test (requires server running)'
    }
  ];

  for (const test of tests) {
    try {
      await runTest(test.file, test.description);
      console.log(`\n⏱️  Waiting 2 seconds before next test...\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`\n⚠️  Continuing with next test despite failure...\n`);
    }
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('🏁 All tests completed!');
  console.log(`${'='.repeat(80)}`);
}

// Check if specific test requested
const args = process.argv.slice(2);
if (args.length > 0) {
  const testName = args[0];
  const testMap = {
    'destination': 'tests/test-destination-extraction.js',
    'apify': 'tests/test-apify-integration.js', 
    'full': 'tests/test-full-integration.js'
  };
  
  if (testMap[testName]) {
    runTest(testMap[testName], `${testName} test`).catch(console.error);
  } else {
    console.log('Available tests: destination, apify, full');
    console.log('Usage: node tests/run-tests.js [test-name]');
    console.log('       node tests/run-tests.js (runs all tests)');
  }
} else {
  runAllTests().catch(console.error);
}