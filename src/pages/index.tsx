import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plane, MapPin, Calendar } from 'lucide-react';

export default function Home() {
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate travel plan');
        return;
      }

      router.push({
        pathname: '/results',
        query: { data: JSON.stringify(data.travelPlan) }
      });
    } catch (err) {
      console.error('Error generating travel plan:', err);
      setError('Failed to generate travel plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Travel Concierge
          </h1>
          <p className="text-xl text-gray-600">
            Tell us your travel dreams, we'll create your perfect itinerary
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your ideal trip
              </label>
              <textarea
                id="request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Plan a week in Paris for work + leisure"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !request.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating your itinerary...
                </>
              ) : (
                <>
                  <Plane size={20} />
                  Plan My Trip
                </>
              )}
            </button>
          </form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <MapPin className="mx-auto mb-2 text-blue-600" size={24} />
              <h3 className="font-semibold">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">AI-powered suggestions for flights, hotels & activities</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
              <h3 className="font-semibold">Daily Itinerary</h3>
              <p className="text-sm text-gray-600">Organized schedule with calendar integration</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Plane className="mx-auto mb-2 text-blue-600" size={24} />
              <h3 className="font-semibold">Instant Booking</h3>
              <p className="text-sm text-gray-600">Direct links to book flights, hotels & experiences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}