import { useState } from 'react';
import { MapPin, Navigation, Clock, LogOut, History, Smartphone } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import TripTracking from './TripTracking';
import Payment from './Payment';
import TripHistory from './TripHistory';
import NairobiMap from '../NairobiMap';
import { toast } from 'sonner';

export default function PassengerHome({ onRequestTrip, onViewHistory }) {
  const { user, logout } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const locations = [
    { id: 1, address: 'JKIA Airport', lat: -1.3192, lng: 36.9278 },
    { id: 2, address: 'Westlands', lat: -1.2676, lng: 36.8108 },
    { id: 3, address: 'CBD - Kencom', lat: -1.2864, lng: 36.8172 },
    { id: 4, address: 'Karen Shopping Centre', lat: -1.3197, lng: 36.6859 },
    { id: 5, address: 'Sarit Centre', lat: -1.2530, lng: 36.7857 },
    { id: 6, address: 'Village Market', lat: -1.2408, lng: 36.8034 },
    { id: 7, address: 'Junction Mall', lat: -1.2362, lng: 36.8905 },
    { id: 8, address: 'Two Rivers Mall', lat: -1.2111, lng: 36.8062 }
  ];

  const handlePickupChange = (value) => {
    setPickup(value);
    if (value.length > 0) {
      setPickupSuggestions(locations.filter(loc => 
        loc.address.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDropoffChange = (value) => {
    setDropoff(value);
    if (value.length > 0) {
      setDropoffSuggestions(locations.filter(loc => 
        loc.address.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setDropoffSuggestions([]);
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateFare = (distance) => {
    const BASE_FARE = 200;
    const RATE_PER_KM = 50;
    return BASE_FARE + (distance * RATE_PER_KM);
  };

  const handleRequest = async () => {
    if (!pickup || !dropoff) {
      toast.error('Please select both pickup and dropoff locations');
      return;
    }

    const pickupLoc = locations.find(l => l.address === pickup);
    const dropoffLoc = locations.find(l => l.address === dropoff);
    
    if (!pickupLoc || !dropoffLoc) {
      toast.error('Please select valid locations from the suggestions');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create trip and notify online drivers
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pickup: {
            lat: pickupLoc.lat,
            lng: pickupLoc.lng,
            address: pickupLoc.address
          },
          dropoff: {
            lat: dropoffLoc.lat,
            lng: dropoffLoc.lng,
            address: dropoffLoc.address
          },
          notifyDrivers: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentTrip(data.data);
        toast.success('Trip requested! Looking for nearby drivers...');
      } else {
        toast.error(data.error?.message || 'Failed to request trip');
      }
    } catch (error) {
      console.error('Trip request error:', error);
      toast.error('Failed to request trip');
    }
  };
  
  const handleTripComplete = () => {
    setShowPayment(true);
  };
  
  const handlePaymentComplete = () => {
    setCurrentTrip(null);
    setShowPayment(false);
    setPickup('');
    setDropoff('');
    toast.success('Trip completed successfully!');
  };
  
  const handleCancelTrip = () => {
    setCurrentTrip(null);
    toast.info('Trip cancelled');
  };
  
  // Show trip tracking if there's an active trip
  if (currentTrip && !showPayment) {
    return (
      <TripTracking
        trip={currentTrip}
        onComplete={handleTripComplete}
        onCancel={handleCancelTrip}
      />
    );
  }
  
  // Show payment screen
  if (showPayment && currentTrip) {
    return (
      <Payment
        trip={currentTrip}
        onPaymentComplete={handlePaymentComplete}
        onBack={() => setShowPayment(false)}
      />
    );
  }
  
  // Show trip history
  if (showHistory) {
    return (
      <TripHistory onBack={() => setShowHistory(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback style={{ backgroundColor: '#2AD7A1', color: 'white' }}>
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-600">Good evening</p>
            <p className="font-medium">{user?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)}>
            <History className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative h-[45vh]">
        <NairobiMap />
      </div>

      {/* Request Card */}
      <div className="px-4 -mt-6 pb-4">
        <Card className="p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Where would you like to go?</h2>
          

          
          {pickup && dropoff && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Estimated Fare:</span>
                <span className="text-lg font-bold text-green-600">KES 450</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Smartphone className="w-3 h-3" />
                <span>Payment via M-Pesa</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <div className="w-3 h-3 rounded-full bg-turquoise" />
                <Input
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => handlePickupChange(e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0"
                />
              </div>
              {pickupSuggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 p-2">
                  {pickupSuggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded"
                      onClick={() => {
                        setPickup(loc.address);
                        setPickupSuggestions([]);
                      }}
                    >
                      <p className="text-sm">{loc.address}</p>
                    </button>
                  ))}
                </Card>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                <MapPin className="w-4 h-4 text-navy" />
                <Input
                  placeholder="Dropoff location"
                  value={dropoff}
                  onChange={(e) => handleDropoffChange(e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0"
                />
              </div>
              {dropoffSuggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 p-2">
                  {dropoffSuggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded"
                      onClick={() => {
                        setDropoff(loc.address);
                        setDropoffSuggestions([]);
                      }}
                    >
                      <p className="text-sm">{loc.address}</p>
                    </button>
                  ))}
                </Card>
              )}
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-turquoise hover:bg-turquoise/90 text-white"
            onClick={handleRequest}
            disabled={!pickup || !dropoff}
          >
            Request Driver
          </Button>
          
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                  });
                }
              }}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Use Current Location
            </Button>
          </div>

          {/* Recent locations */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Recent locations</p>
            <div className="space-y-2">
              {locations.slice(0, 2).map((loc, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full text-left"
                  onClick={() => setDropoff(loc.address)}
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}