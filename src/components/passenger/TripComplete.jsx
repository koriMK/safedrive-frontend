import React, { useState, useEffect } from 'react';
import { Star, MapPin, Receipt, Home } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5002/api/v1';

export const TripComplete = ({
  driverId,
  pickup,
  dropoff,
  fare,
  paymentId,
  onDone,
}) => {
  const [driver, setDriver] = useState({ name: 'Driver', vehicle: { plate: 'KCA 123A' } });
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/trips/${paymentId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          feedback
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Thank you for your feedback!');
        setTimeout(() => onDone(), 1000);
      } else {
        throw new Error(data.error?.message || 'Rating failed');
      }
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => setShowReceipt(false)}
            className="mb-4"
          >
            ← Back
          </Button>

          <Card className="p-6">
            <div className="text-center mb-6">
              <Receipt className="w-12 h-12 mx-auto mb-2" style={{ color: '#2AD7A1' }} />
              <h2>Trip Receipt</h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Driver</p>
                <p>{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.vehicle.plate}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: '#2AD7A1' }} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-sm">{pickup.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#0E1F40' }} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="text-sm">{dropoff.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Fare</span>
                  <span>KES {(fare * 0.7).toFixed(0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Distance Charge</span>
                  <span>KES {(fare * 0.3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Total Paid</span>
                  <span>KES {fare.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span>M-Pesa</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
                <Badge className="mt-2" style={{ backgroundColor: '#2AD7A1' }}>Paid</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowReceipt(false)}
            >
              Close
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2AD7A1' }}>
            <Home className="w-8 h-8 text-white" />
          </div>
          <h2 className="mb-2">Trip Completed!</h2>
          <p className="text-gray-600">You've arrived safely</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Fare</span>
            <span className="text-2xl">KES {fare.toLocaleString()}</span>
          </div>
          <Badge style={{ backgroundColor: '#2AD7A1' }}>Paid via M-Pesa</Badge>
        </div>

        <div className="mb-6">
          <p className="text-sm mb-3">How was your trip with {driver.name}?</p>
          <div className="flex gap-2 justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={handleSubmit}
            style={{ backgroundColor: '#2AD7A1' }}
          >
            Submit Rating
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowReceipt(true)}
          >
            <Receipt className="w-4 h-4 mr-2" />
            View Receipt
          </Button>
        </div>
      </Card>
    </div>
  );
};