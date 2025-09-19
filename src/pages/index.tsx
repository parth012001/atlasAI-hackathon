import { useState } from 'react';
import { useRouter } from 'next/router';
import { Plane, MapPin, Calendar } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    description: '',
    departureDate: '',
    returnDate: '',
    flightBudget: '',
    hotelBudget: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Instant navigation - no loading state!
    router.push({
      pathname: '/results',
      query: { 
        request: formData.description,
        travelData: JSON.stringify(formData)
      }
    });
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

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let's Plan Your Perfect Trip
              </h2>
              <p className="text-gray-600">
                Tell us your preferences and we'll create a personalized itinerary
              </p>
            </div>

            {/* Trip Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                🌍 Describe Your Ideal Trip
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="I want to spend a week in Paris mixing business meetings with leisure activities. Looking for cultural experiences and great restaurants..."
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="departureDate" className="block text-sm font-semibold text-gray-700 mb-3">
                  ✈️ Departure Date
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="returnDate" className="block text-sm font-semibold text-gray-700 mb-3">
                  🏠 Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  min={formData.departureDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Budget Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="flightBudget" className="block text-sm font-semibold text-gray-700 mb-3">
                  ✈️ Flight Budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="flightBudget"
                    name="flightBudget"
                    value={formData.flightBudget}
                    onChange={handleInputChange}
                    placeholder="1000"
                    min="0"
                    step="50"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Total budget for round-trip flights</p>
              </div>
              <div>
                <label htmlFor="hotelBudget" className="block text-sm font-semibold text-gray-700 mb-3">
                  🏨 Hotel Budget (USD/night)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="hotelBudget"
                    name="hotelBudget"
                    value={formData.hotelBudget}
                    onChange={handleInputChange}
                    placeholder="200"
                    min="0"
                    step="25"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Budget per night for accommodation</p>
              </div>
            </div>

            {/* Trip Summary */}
            {formData.departureDate && formData.returnDate && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Trip Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Duration:</span>
                    <p className="text-blue-900">
                      {Math.ceil((new Date(formData.returnDate).getTime() - new Date(formData.departureDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Departure:</span>
                    <p className="text-blue-900">{new Date(formData.departureDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Return:</span>
                    <p className="text-blue-900">{new Date(formData.returnDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Est. Total:</span>
                    <p className="text-blue-900">
                      ${(parseInt(formData.flightBudget || '0') + 
                          (parseInt(formData.hotelBudget || '0') * 
                           Math.ceil((new Date(formData.returnDate).getTime() - new Date(formData.departureDate).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={!formData.description.trim() || !formData.departureDate || !formData.returnDate}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <Plane size={24} />
              Create My Travel Plan
              <span className="text-sm font-normal opacity-90">✨</span>
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