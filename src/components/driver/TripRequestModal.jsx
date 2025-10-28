import { useState, useEffect } from 'react';
import { MapPin, User, DollarSign, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';

export default function TripRequestModal({ onAccept, onReject }) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  const progress = (timeLeft / 10) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-turquoise flex items-center justify-center animate-pulse">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">New Trip Request!</h2>
          <p className="text-sm text-gray-500">Accept or reject in {timeLeft}s</p>
        </div>

        <Progress value={progress} className="h-2 mb-6 bg-gray-200">
          <div 
            className="h-full bg-turquoise transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </Progress>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Passenger</p>
              <p className="font-medium">John Kamau</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-turquoise mt-1.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">Westlands, Nairobi</p>
              <p className="text-xs text-gray-500 mt-1">3.2 km away</p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-gray-300 h-6 ml-1.5" />

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 mt-0.5 text-navy" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Dropoff</p>
              <p className="font-medium">Karen, Nairobi</p>
              <p className="text-xs text-gray-500 mt-1">12.5 km trip</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-turquoise" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Estimated Fare</p>
              <p className="text-xl font-semibold">KES 850</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onReject}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
          <Button
            onClick={onAccept}
            className="bg-turquoise hover:bg-turquoise/90 text-white"
          >
            Accept Trip
          </Button>
        </div>
      </Card>
    </div>
  );
}