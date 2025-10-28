import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MapPin, DollarSign } from 'lucide-react';
import api from '../../lib/api';

export default function TripRequest() {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    pickupLat: '',
    pickupLng: '',
    dropoffLat: '',
    dropoffLng: ''
  });
  const [loading, setLoading] = useState(false);
  const [tripEstimate, setTripEstimate] = useState(null);
  const [error, setError] = useState('');
  
  const calculateEstimate = () => {
    // Mock calculation - in real app, use Google Maps API
    const distance = Math.random() * 20 + 5; // 5-25 km
    const duration = Math.round(distance * 2.5); // ~2.5 min per km
    const fare = Math.round(distance * 60 + 200); // Base fare + per km
    
    setTripEstimate({
      distance: distance.toFixed(1),
      duration,
      fare
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Mock coordinates for demo
      const tripData = {
        pickup: {
          lat: -1.286389,
          lng: 36.817223,
          address: formData.pickupAddress
        },
        dropoff: {
          lat: -1.292066,
          lng: 36.821946,
          address: formData.dropoffAddress
        }
      };
      
      const response = await api.post('/trips', tripData);
      alert('Trip requested successfully! Looking for available drivers...');
      
      // Reset form
      setFormData({
        pickupAddress: '',
        dropoffAddress: '',
        pickupLat: '',
        pickupLng: '',
        dropoffLat: '',
        dropoffLng: ''
      });
      setTripEstimate(null);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request a Driver</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  id="pickup"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  placeholder="Enter pickup address"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dropoff">Dropoff Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                <Input
                  id="dropoff"
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({...formData, dropoffAddress: e.target.value})}
                  placeholder="Enter dropoff address"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={calculateEstimate}
              className="w-full"
            >
              Get Estimate
            </Button>
            
            {tripEstimate && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-navy">{tripEstimate.distance} km</div>
                      <div className="text-sm text-gray-600">Distance</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-navy">{tripEstimate.duration} min</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-turquoise">KSh {tripEstimate.fare}</div>
                      <div className="text-sm text-gray-600">Estimated Fare</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading || !tripEstimate}>
              {loading ? 'Requesting...' : 'Request Driver'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}