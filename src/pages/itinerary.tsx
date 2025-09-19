import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Clock, Star, DollarSign } from 'lucide-react';
import type { TravelPlan } from '@/types';

export default function Itinerary() {
  const router = useRouter();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.data) {
      try {
        const plan = JSON.parse(router.query.data as string);
        setTravelPlan(plan);
      } catch (error) {
        console.error('Failed to parse travel plan:', error);
      }
    }
    setLoading(false);
  }, [router.query.data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!travelPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No travel plan found</h1>
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
        <header className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
            <h1 className="text-5xl font-bold mb-4">
              🎉 Your {travelPlan.destination} Adventure
            </h1>
            <p className="text-xl opacity-90 mb-4">
              {travelPlan.duration} days of perfectly planned experiences
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                ✈️ Flights Included
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                🏨 Hotel Booked
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                🎯 Activities Planned
              </span>
            </div>
          </div>
        </header>

        {/* Flights & Hotel Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Plane className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Outbound Flight</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{travelPlan.outboundFlight.airline}</p>
            <p className="font-medium">{travelPlan.outboundFlight.departure.airport} → {travelPlan.outboundFlight.arrival.airport}</p>
            <p className="text-sm text-gray-600">{travelPlan.outboundFlight.departure.date} at {travelPlan.outboundFlight.departure.time}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">${travelPlan.outboundFlight.price}</span>
              <a
                href={travelPlan.outboundFlight.bookingUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Flight
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Hotel</h3>
            </div>
            <p className="font-medium mb-1">{travelPlan.hotel.name}</p>
            <p className="text-sm text-gray-600 mb-2">{travelPlan.hotel.address}</p>
            <div className="flex items-center mb-2">
              <Star className="text-yellow-500 mr-1" size={16} />
              <span className="text-sm">{travelPlan.hotel.rating}/5</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">${travelPlan.hotel.pricePerNight}/night</span>
              <a
                href={travelPlan.hotel.bookingUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Hotel
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-semibold">Total Cost</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">${travelPlan.totalCost}</p>
            <p className="text-sm text-gray-600">Estimated total for {travelPlan.duration} days</p>
            <div className="mt-4">
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                💾 Save Itinerary
              </button>
            </div>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Daily Itinerary</h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {travelPlan.duration} Days Total
            </span>
          </div>
          
          <div className="space-y-8">
            {travelPlan.itinerary.map((day, dayIndex) => {
              const dayNumber = dayIndex + 1;
              const isFirstDay = dayIndex === 0;
              const isLastDay = dayIndex === travelPlan.itinerary.length - 1;
              
              return (
                <div key={dayIndex} className={`relative ${
                  isFirstDay ? 'border-l-4 border-green-500' : 
                  isLastDay ? 'border-l-4 border-red-500' : 
                  'border-l-4 border-blue-500'
                } pl-8 pb-8`}>
                  
                  {/* Day Header */}
                  <div className={`absolute left-[-12px] top-0 w-6 h-6 rounded-full ${
                    isFirstDay ? 'bg-green-500' : 
                    isLastDay ? 'bg-red-500' : 
                    'bg-blue-500'
                  } flex items-center justify-center text-white text-xs font-bold`}>
                    {dayNumber}
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          Day {dayNumber}
                          {isFirstDay && <span className="text-green-600 text-sm ml-2">(Arrival)</span>}
                          {isLastDay && <span className="text-red-600 text-sm ml-2">(Departure)</span>}
                        </h3>
                        <p className="text-gray-600 flex items-center mt-1">
                          <Calendar size={16} className="mr-2" />
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {['morning', 'afternoon', 'evening'].map((timeSlot) => {
                        const activities = day.activities.filter(act => act.timeSlot === timeSlot);
                        const timeEmoji = timeSlot === 'morning' ? '🌅' : timeSlot === 'afternoon' ? '☀️' : '🌙';
                        
                        return (
                          <div key={timeSlot} className="bg-white rounded-lg border-2 border-gray-100 p-5 hover:border-blue-200 transition-colors">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                              <span className="mr-2">{timeEmoji}</span>
                              <span className="capitalize">{timeSlot}</span>
                            </h4>
                            
                            {activities.length > 0 ? (
                              <div className="space-y-4">
                                {activities.map((activity) => (
                                  <div key={activity.id} className={`relative p-4 rounded-lg border-2 ${
                                    activity.category === 'surprise' 
                                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                                      : activity.category === 'business'
                                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300'
                                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                                  } hover:shadow-md transition-shadow`}>
                                    
                                    {/* Activity Header */}
                                    <div className="flex justify-between items-start mb-3">
                                      <h5 className="font-semibold text-gray-900 text-base leading-tight">{activity.name}</h5>
                                      {activity.category === 'surprise' && (
                                        <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                                          ✨ SURPRISE!
                                        </span>
                                      )}
                                    </div>
                                    
                                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{activity.description}</p>
                                    
                                    {/* Activity Details */}
                                    <div className="flex justify-between items-center mb-3">
                                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                                        <span className="flex items-center">
                                          <Clock size={14} className="mr-1" />
                                          {activity.duration}
                                        </span>
                                        <span className="flex items-center">
                                          <MapPin size={14} className="mr-1" />
                                          {activity.location}
                                        </span>
                                      </div>
                                      {activity.price && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                          ${activity.price}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Booking Button */}
                                    {activity.bookingUrl && (
                                      <a
                                        href={activity.bookingUrl}
                                        className="inline-block w-full text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Book Now
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">✨ Free time to explore!</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Plan Another Trip
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🖨️ Print Itinerary
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
              📧 Email Itinerary
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Generated with real-time flight data from Skyscanner • Powered by AI Travel Concierge
          </div>
        </div>
      </div>
    </div>
  );
}