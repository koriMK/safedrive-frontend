import { useState, useEffect } from 'react';
import { Navigation, AlertCircle, Share2, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { mockDrivers } from '../../lib/mockData';

export default function LiveTracking({ driverId, pickup, dropoff, onTripComplete }) {
  const driver = mockDrivers.find(d => d.id === driverId) || mockDrivers[0];
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onTripComplete(), 1000);
          return 100;
        }
        return prev + 5;
      });
      
      setEta(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [onTripComplete]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map */}
      <div className="relative h-[60vh] bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-20 h-20 mx-auto mb-3 animate-pulse text-turquoise" />
            <Badge className="mb-2 bg-turquoise text-white">
              Trip in Progress
            </Badge>
            <p className="text-gray-600">ETA: {eta} min</p>
          </div>
        </div>

        {/* Emergency button */}
        <Button
          size="sm"
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Emergency
        </Button>

        {/* Share trip */}
        <Button
          size="sm"
          variant="outline"
          className="absolute top-4 left-4 bg-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Trip
        </Button>
      </div>

      {/* Trip Info */}
      <div className="px-4 -mt-8 pb-4">
        <Card className="p-6 shadow-lg">
          {/* Driver Info - Compact */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <Avatar className="w-12 h-12">
              <AvatarFallback style={{ backgroundColor: '#0E1F40', color: 'white' }}>
                {driver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{driver.name}</p>
              <p className="text-sm text-gray-500">{driver.vehicle.plate}</p>
            </div>
            <Badge className="bg-turquoise text-white">Driving</Badge>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Trip Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-turquoise transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Route */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-turquoise mt-1.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="text-sm font-medium">{pickup.address}</p>
              </div>
            </div>
            
            <div className="border-l-2 border-dashed border-gray-300 h-6 ml-1.5" />
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-navy" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Destination</p>
                <p className="text-sm font-medium">{dropoff.address}</p>
              </div>
            </div>
          </div>

          {/* Safety Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p>Your trip is being tracked in real-time. Share your trip with friends and family for added safety.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}