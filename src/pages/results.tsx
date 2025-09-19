import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Clock, Star, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import type { TravelPlan } from '@/types';

export default function Results() {
  const router = useRouter();
  const [request, setRequest] = useState('');
  const [travelData, setTravelData] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState({
    parsing: 'loading', // loading, completed, error
    flights: 'pending', // pending, loading, completed, error  
    hotels: 'pending',
    itinerary: 'pending'
  });
  
  const [parsedData, setParsedData] = useState<any>(null);
  const [flightData, setFlightData] = useState<any>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

  useEffect(() => {
    if (router.query.request && router.query.travelData) {
      setRequest(router.query.request as string);
      setTravelData(JSON.parse(router.query.travelData as string));
      
      // Start the progressive loading process
      startProgressiveLoading();
    }
  }, [router.query]);

  const startProgressiveLoading = async () => {
    try {
      // Step 1: Parse destination
      setLoadingStates(prev => ({ ...prev, parsing: 'loading' }));
      
      const parseResponse = await fetch('/api/parse-destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          request: router.query.request,
          travelData: JSON.parse(router.query.travelData as string)
        })
      });
      
      const parsed = await parseResponse.json();
      setParsedData(parsed);
      setLoadingStates(prev => ({ ...prev, parsing: 'completed', flights: 'loading' }));
      
      // Step 2: Fetch flights
      setTimeout(async () => {
        const flightResponse = await fetch('/api/fetch-flights', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        
        const flights = await flightResponse.json();
        setFlightData(flights);
        setLoadingStates(prev => ({ ...prev, flights: 'completed', hotels: 'loading' }));
        
        // Step 3: Generate itinerary
        setTimeout(async () => {
          setLoadingStates(prev => ({ ...prev, hotels: 'completed', itinerary: 'loading' }));
          
          const planResponse = await fetch('/api/generate-full-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parsed, flights, travelData: JSON.parse(router.query.travelData as string) })
          });
          
          const plan = await planResponse.json();
          setTravelPlan(plan);
          setLoadingStates(prev => ({ ...prev, itinerary: 'completed' }));
        }, 1000);
      }, 1500);
      
    } catch (error) {
      console.error('Progressive loading error:', error);
    }
  };

  const LoadingCard = ({ title, state, children }: { title: string, state: string, children?: React.ReactNode }) => (
    <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-500 ${
      state === 'completed' ? 'border-l-4 border-green-500' : 
      state === 'loading' ? 'border-l-4 border-blue-500' : 
      'border-l-4 border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {state === 'loading' && <Loader2 className="animate-spin text-blue-600" size={20} />}
        {state === 'completed' && <CheckCircle className="text-green-600" size={20} />}
        {state === 'pending' && <Clock className="text-gray-400" size={20} />}
      </div>
      
      {state === 'loading' && (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      )}
      
      {state === 'pending' && (
        <p className="text-gray-500 text-sm">Waiting for previous steps...</p>
      )}
      
      {state === 'completed' && children}
    </div>
  );

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No travel request found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Plan New Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
            <h1 className="text-5xl font-bold mb-4">
              🎉 Creating Your {parsedData?.destination || '...'} Adventure
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {travelData?.departureDate && travelData?.returnDate ? 
                `${Math.ceil((new Date(travelData.returnDate).getTime() - new Date(travelData.departureDate).getTime()) / (1000 * 60 * 60 * 24))} days` : 
                '...'
              } of perfectly planned experiences
            </p>
            <div className="text-sm opacity-75">
              "{request}"
            </div>
          </div>
        </header>

        {/* Progressive Loading Cards */}
        <div className="space-y-6 mb-8">
          
          {/* Step 1: Destination Parsing */}
          <LoadingCard title="🎯 Understanding Your Destination" state={loadingStates.parsing}>
            {parsedData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Destination:</span>
                  <p className="font-semibold">{parsedData.destination}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Airport:</span>
                  <p className="font-semibold">{parsedData.destinationCode}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Purpose:</span>
                  <p className="font-semibold capitalize">{parsedData.purpose}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Budget:</span>
                  <p className="font-semibold capitalize">{parsedData.budget}</p>
                </div>
              </div>
            )}
          </LoadingCard>

          {/* Step 2: Flight Search */}
          <LoadingCard title="✈️ Finding Perfect Flights" state={loadingStates.flights}>
            {flightData && Array.isArray(flightData) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🔍 Search Results</h4>
                    <p className="text-2xl font-bold text-blue-600">{flightData.length}</p>
                    <p className="text-xs text-gray-600">flights found</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">💰 Best Price</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ${flightData[0]?.cheapest_price?.amount || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">round trip</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Your Budget</h4>
                    <p className="text-2xl font-bold text-purple-600">${travelData?.flightBudget}</p>
                    <p className="text-xs text-gray-600">
                      {(flightData[0]?.cheapest_price?.amount || 0) * 2 <= parseInt(travelData?.flightBudget || '0') 
                        ? '✅ Within budget' 
                        : '⚠️ Over budget'}
                    </p>
                  </div>
                </div>
                
                {flightData.slice(0, 3).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Top Flight Options:</h4>
                    <div className="space-y-2">
                      {flightData.slice(0, 3).map((flight, index) => (
                        <div key={flight.id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                          <div>
                            <span className="font-medium text-sm">
                              Option {index + 1} - Score: {flight.score?.toFixed(1)}
                            </span>
                            <p className="text-xs text-gray-500">
                              {flight.legs?.[0]?.departure_time || 'TBD'} → {flight.legs?.[0]?.arrival_time || 'TBD'}
                            </p>
                          </div>
                          <span className="font-bold text-green-600">
                            ${flight.cheapest_price?.amount || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center">
                  🔄 Real-time data from Skyscanner • Updated: {flightData[0]?.cheapest_price?.last_updated ? new Date(flightData[0].cheapest_price.last_updated).toLocaleTimeString() : 'Just now'}
                </div>
              </div>
            )}
          </LoadingCard>

          {/* Step 3: Hotel Search */}
          <LoadingCard title="🏨 Selecting Accommodations" state={loadingStates.hotels}>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Finding hotels within ${travelData?.hotelBudget}/night budget
              </p>
            </div>
          </LoadingCard>

          {/* Step 4: Itinerary Generation */}
          <LoadingCard title="🗓️ Crafting Your Daily Itinerary" state={loadingStates.itinerary}>
            {travelPlan && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold">Total Cost</h4>
                    <p className="text-2xl font-bold text-green-600">${travelPlan.totalCost}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold">Activities</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {travelPlan.itinerary?.reduce((acc, day) => acc + day.activities.length, 0)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold">Surprises</h4>
                    <p className="text-2xl font-bold text-yellow-600">
                      {travelPlan.itinerary?.reduce((acc, day) => 
                        acc + day.activities.filter(act => act.category === 'surprise').length, 0
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push({
                    pathname: '/itinerary',
                    query: { data: JSON.stringify(travelPlan) }
                  })}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 text-lg font-semibold"
                >
                  View Complete Itinerary →
                </button>
              </div>
            )}
          </LoadingCard>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Creating your travel plan...</span>
            <span>
              {Object.values(loadingStates).filter(state => state === 'completed').length}/4 complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${(Object.values(loadingStates).filter(state => state === 'completed').length / 4) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}