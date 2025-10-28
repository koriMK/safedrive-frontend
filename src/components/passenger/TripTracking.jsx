import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Star, Navigation, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import NairobiMap from '../NairobiMap';

export default function TripTracking({ trip, onComplete, onCancel }) {
  const [currentStatus, setCurrentStatus] = useState('requested');
  const [eta, setEta] = useState(8);
  const [driverLocation, setDriverLocation] = useState({ lat: -1.2921, lng: 36.8219 });
  
  // Safety check
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'requested', label: 'Trip Requested', completed: true },
    { key: 'accepted', label: 'Driver Assigned', completed: currentStatus !== 'requested' },
    { key: 'enroute', label: 'Driver En Route', completed: ['enroute', 'arrived', 'started', 'completed'].includes(currentStatus) },
    { key: 'arrived', label: 'Driver Arrived', completed: ['arrived', 'started', 'completed'].includes(currentStatus) },
    { key: 'started', label: 'Trip Started', completed: ['started', 'completed'].includes(currentStatus) },
    { key: 'completed', label: 'Trip Completed', completed: currentStatus === 'completed' }
  ];

  const mockDriver = {
    id: 'driver_123',
    name: 'John Kamau',
    phone: '+254712345678',
    rating: 4.8,
    totalTrips: 1247,
    vehicle: {
      make: 'Toyota',
      model: 'Corolla',
      plate: 'KCA 123A',
      color: 'White'
    },
    photo: null
  };

  useEffect(() => {
    // Simulate trip progress
    const interval = setInterval(() => {
      if (currentStatus === 'requested') {
        setCurrentStatus('accepted');
        setEta(8);
      } else if (currentStatus === 'accepted') {
        setCurrentStatus('enroute');
        setEta(6);
      } else if (currentStatus === 'enroute') {
        setCurrentStatus('arrived');
        setEta(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'requested':
        return 'Looking for nearby drivers...';
      case 'accepted':
        return `${mockDriver.name} is coming to pick you up`;
      case 'enroute':
        return `${mockDriver.name} is on the way`;
      case 'arrived':
        return `${mockDriver.name} has arrived at pickup location`;
      case 'started':
        return 'Trip in progress';
      case 'completed':
        return 'Trip completed successfully';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Area */}
      <div className="relative h-[50vh]">
        <NairobiMap />
        
        {/* ETA Badge */}
        {eta > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-turquoise text-white px-3 py-1">
              <Clock className="w-3 h-3 mr-1" />
              {eta} min
            </Badge>
          </div>
        )}
      </div>

      {/* Trip Status */}
      <div className="px-4 -mt-6 pb-4">
        <Card className="p-4 shadow-lg mb-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">{getStatusMessage()}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentStatus === 'arrived' ? 'Your driver is waiting' : 
               eta > 0 ? `Estimated arrival: ${eta} minutes` : ''}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-2">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  step.completed ? 'bg-turquoise' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Driver Info */}
        {currentStatus !== 'requested' && (
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-navy text-white">
                  {mockDriver.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{mockDriver.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{mockDriver.rating}</span>
                  <span>•</span>
                  <span>{mockDriver.totalTrips} trips</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vehicle:</span>
                <span>{mockDriver.vehicle.color} {mockDriver.vehicle.make} {mockDriver.vehicle.model}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">License Plate:</span>
                <span className="font-mono">{mockDriver.vehicle.plate}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Trip Details */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">Trip Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-turquoise mt-1.5" />
              <div>
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-medium">{trip.pickup_address || 'Westlands, Nairobi'}</p>
              </div>
            </div>
            
            <div className="border-l-2 border-dashed border-gray-300 h-6 ml-1.5" />
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-navy" />
              <div>
                <p className="text-sm text-gray-500">Dropoff</p>
                <p className="font-medium">{trip.dropoff_address || 'Karen, Nairobi'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Fare:</span>
              <span className="font-semibold">KES {trip.fare || 850}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStatus === 'started' && (
            <Button
              className="w-full bg-turquoise hover:bg-turquoise/90"
              onClick={() => {
                setCurrentStatus('completed');
                setTimeout(() => onComplete(), 1000);
              }}
            >
              Complete Trip (Demo)
            </Button>
          )}
          
          {['requested', 'accepted', 'enroute'].includes(currentStatus) && (
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={onCancel}
            >
              Cancel Trip
            </Button>
          )}
          
          {currentStatus === 'arrived' && (
            <Button
              className="w-full bg-turquoise hover:bg-turquoise/90"
              onClick={() => setCurrentStatus('started')}
            >
              Start Trip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}