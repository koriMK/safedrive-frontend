import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Calendar, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export default function TripHistory({ onBack }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripHistory();
  }, []);

  const fetchTripHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/v1/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setTrips(data.data.trips || []);
      }
    } catch (error) {
      console.error('Failed to fetch trip history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turquoise mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Trip History</h1>
      </div>

      <div className="p-4">
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500">Your trip history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(trip.status)}>
                        {trip.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-3 h-3 rounded-full bg-turquoise mt-1.5" />
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="text-sm font-medium">{trip.pickup.address}</p>
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1.5" />
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 mt-1.5 text-navy" />
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="text-sm font-medium">{trip.dropoff.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold">KES {trip.fare}</p>
                    <p className="text-xs text-gray-500">{trip.distance} km</p>
                  </div>
                </div>

                {trip.rating && (
                  <div className="flex items-center gap-1 pt-3 border-t">
                    <span className="text-sm text-gray-600">Your rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= trip.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {trip.feedback && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <p className="text-gray-600">"{trip.feedback}"</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}