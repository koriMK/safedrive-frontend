import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Star, MapPin, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { mockDrivers } from '../../lib/mockData';

export default function DriverAssigned({ driverId, pickup, onTripStart }) {
  const driver = mockDrivers.find(d => d.id === driverId) || mockDrivers[0];
  const [eta, setEta] = useState(8);
  const [status, setStatus] = useState('arriving');

  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) {
          setStatus('arrived');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'arrived') {
      const timer = setTimeout(() => {
        onTripStart();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onTripStart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map */}
      <div className="relative h-[55vh] bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-16 h-16 mx-auto mb-2 animate-pulse text-turquoise" />
            <p className="text-gray-600">Driver en route</p>
            {status === 'arriving' ? (
              <p className="mt-2 font-semibold">ETA: {eta} min</p>
            ) : (
              <Badge className="mt-2 bg-turquoise text-white">
                Driver has arrived
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="px-4 -mt-12 pb-4">
        <Card className="p-6 shadow-lg">
          {status === 'arrived' && (
            <div className="mb-4 p-3 rounded-lg text-center bg-turquoise text-white">
              <p>Your driver has arrived at pickup location</p>
            </div>
          )}

          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback style={{ backgroundColor: '#0E1F40', color: 'white' }}>
                {driver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{driver.name}</h3>
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{driver.rating}</span>
                <span className="text-sm text-gray-500">({driver.totalTrips} trips)</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model}</p>
                <p className="mt-0.5 font-medium">{driver.vehicle.plate}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full p-2">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-full p-2">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-turquoise mt-1.5" />
              <div>
                <p className="text-sm text-gray-500">Pickup location</p>
                <p className="font-medium">{pickup.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {status === 'arriving' 
                ? `Your driver is ${eta} minutes away` 
                : 'Please meet your driver at the pickup location'
              }
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}