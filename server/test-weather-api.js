const fetch = require('node-fetch');

// Test script for Weather Intelligence API endpoints
const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Weather Intelligence API Endpoints...\n');

  // Test 1: Store weather insight
  console.log('1. Testing POST /weather-insights');
  try {
    const weatherInsight = {
      date: new Date().toISOString(),
      location: 'Auckland, NZ',
      weather: {
        temperature: 18.5,
        description: 'light rain',
        humidity: 78,
        windSpeed: 3.2,
        pressure: 1015
      },
      aiInsights: 'Rain suggests indoor activity focus. Recommend comfort products and home services.',
      recommendations: {
        generated: true,
        timestamp: new Date().toISOString()
      }
    };

    const response = await fetch(`${BASE_URL}/weather-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weatherInsight)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Get user locations
  console.log('\n2. Testing GET /user-locations');
  try {
    const response = await fetch(`${BASE_URL}/user-locations`);
    const result = await response.json();
    console.log('✅ Response:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Store customer segment
  console.log('\n3. Testing POST /customer-segments');
  try {
    const segment = {
      location: {
        city: 'Auckland',
        country: 'NZ',
        latitude: -36.8485,
        longitude: 174.7633
      },
      weather: {
        temperature: 18.5,
        description: 'light rain',
        humidity: 78,
        windSpeed: 3.2
      },
      segmentation: 'Indoor-focused segment with higher email engagement during rain',
      timestamp: new Date().toISOString(),
      users_affected: 1250
    };

    const response = await fetch(`${BASE_URL}/customer-segments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(segment)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Get active campaigns
  console.log('\n4. Testing GET /active-campaigns');
  try {
    const response = await fetch(`${BASE_URL}/active-campaigns`);
    const result = await response.json();
    console.log('✅ Response:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 5: Store campaign optimization
  console.log('\n5. Testing POST /campaign-optimizations');
  try {
    const optimization = {
      forecast_data: [
        { dt: Date.now()/1000, main: { temp: 19 }, weather: [{ description: 'cloudy' }] }
      ],
      campaigns: [
        { name: 'Summer Content Marketing', budget: 5000 }
      ],
      optimizations: 'Increase indoor content budget by 15% due to expected rain',
      timestamp: new Date().toISOString(),
      confidence_score: 0.85,
      recommendations_count: 3
    };

    const response = await fetch(`${BASE_URL}/campaign-optimizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(optimization)
    });

    const result = await response.json();
    console.log('✅ Response:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 6: Dashboard summary
  console.log('\n6. Testing GET /weather-intelligence/dashboard');
  try {
    const response = await fetch(`${BASE_URL}/weather-intelligence/dashboard`);
    const result = await response.json();
    console.log('✅ Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
}

// Run the tests
testAPI().catch(console.error);