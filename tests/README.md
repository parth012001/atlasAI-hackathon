# Backend Testing Suite

This directory contains test files to debug and validate the AI Travel Concierge backend functionality.

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Make sure your `.env.local` file contains `OPENAI_API_KEY`
   - Tests use the hardcoded Apify token from the code

## Test Files

### 1. Destination Extraction Test
**File:** `test-destination-extraction.js`
**Tests:** Natural language parsing to extract destinations and airport codes

```bash
npm run test:destination
# or
node tests/test-destination-extraction.js
```

**What it checks:**
- ✅ "Paris for work and fun" → destination: "Paris", code: "CDG"
- ✅ "Tokyo cultural experience" → destination: "Tokyo", code: "NRT"  
- ✅ "London business meetings" → destination: "London", code: "LHR"

### 2. Apify API Integration Test
**File:** `test-apify-integration.js`
**Tests:** Direct calls to Apify Skyscanner API

```bash
npm run test:apify
# or
node tests/test-apify-integration.js
```

**What it checks:**
- ✅ API connection and authentication
- ✅ Request format and response structure
- ✅ Sample flight data retrieval
- ✅ Error handling

### 3. Full Integration Test
**File:** `test-full-integration.js`
**Tests:** Complete end-to-end flow through your API endpoint

```bash
# IMPORTANT: Start your Next.js server first!
npm run dev

# Then in another terminal:
npm run test:integration
# or  
node tests/test-full-integration.js
```

**What it checks:**
- ✅ Complete API endpoint workflow
- ✅ Destination extraction + Apify integration
- ✅ Response data structure
- ✅ Multiple destination scenarios

## Run All Tests

```bash
npm run test:backend
# or
node tests/run-tests.js
```

## Expected Output

### ✅ Success Indicators:
- Destination extraction returns proper city names and airport codes
- Apify API returns flight data arrays with price/time information
- Full integration shows complete travel plans with real data

### ❌ Common Issues:
- **OpenAI API errors:** Check your API key in `.env.local`
- **Apify API errors:** Token might be invalid or rate limited
- **Connection refused:** Make sure `npm run dev` is running for integration tests

## Debugging Tips

1. **Check console logs:** All tests include detailed logging
2. **Verify API keys:** Make sure environment variables are set
3. **Network issues:** Check if APIs are accessible
4. **Data format:** Look at the actual API responses in logs

## Test Results Interpretation

- **Destination Extraction:** Should extract major cities and their primary airport codes
- **Apify Integration:** Should return real flight data with prices and schedules  
- **Full Integration:** Should combine both into complete travel plans

If any test fails, check the detailed logs for specific error messages and API responses.