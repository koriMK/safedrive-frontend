import { useState } from 'react';
import { CreditCard, Smartphone, Star, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { toast } from 'sonner';

export default function Payment({ trip, onPaymentComplete, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [paymentStatus, setPaymentStatus] = useState(null);

  const mockDriver = {
    name: 'John Kamau',
    rating: 4.8,
    vehicle: { make: 'Toyota', model: 'Corolla', plate: 'KCA 123A' }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'mpesa' && !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    
    setProcessing(true);
    setPaymentStatus('initiating');
    
    try {
      const token = localStorage.getItem('token');
      
      // Initiate M-Pesa STK Push
      const paymentResponse = await fetch(`${API_BASE_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tripId: trip.id,
          amount: trip.fare,
          phone: phoneNumber
        })
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.success) {
        setPaymentStatus('pending');
        toast.success('STK Push sent to your phone. Please enter your M-Pesa PIN.');
        
        // Poll for payment status
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`${API_BASE_URL}/payments/status/${paymentData.data.paymentId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            const statusData = await statusResponse.json();
            
            if (statusData.success) {
              if (statusData.data.status === 'paid') {
                clearInterval(pollInterval);
                setPaymentStatus('completed');
                
                // Submit rating if provided
                if (rating > 0) {
                  const ratingResponse = await fetch(`${API_BASE_URL}/trips/${trip.id}/rate`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rating, feedback })
                  });
                  
                  if (ratingResponse.ok) {
                    toast.success('Rating saved');
                  }
                }
                
                toast.success('Payment completed successfully!');
                setTimeout(() => onPaymentComplete(), 2000);
                
              } else if (statusData.data.status === 'failed') {
                clearInterval(pollInterval);
                setPaymentStatus('failed');
                toast.error('Payment failed or was cancelled');
                setProcessing(false);
              }
            }
          } catch (error) {
            console.error('Status check error:', error);
          }
        }, 5000);
        
        // Timeout after 3 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          if (paymentStatus === 'pending') {
            setPaymentStatus('timeout');
            toast.error('Payment timeout. Please try again.');
            setProcessing(false);
          }
        }, 180000);
        
      } else {
        throw new Error(paymentData.error?.message || 'Payment initiation failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Payment & Rating</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Trip Summary */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Trip Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span>{trip?.distance || 12.5} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span>{trip?.duration || 25} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Fare:</span>
              <span>KES 200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance Charge:</span>
              <span>KES {((trip?.distance || 12.5) * 50).toFixed(0)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>KES {trip?.fare || 850}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Driver Rating */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Rate Your Driver</h3>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-navy text-white">
                {mockDriver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{mockDriver.name}</h4>
              <p className="text-sm text-gray-500">
                {mockDriver.vehicle.make} {mockDriver.vehicle.model} • {mockDriver.vehicle.plate}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">How was your trip?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Leave feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mb-4"
          />
        </Card>

        {/* Payment Method */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('mpesa')}
              className={`w-full p-4 border rounded-lg flex items-center gap-3 ${
                paymentMethod === 'mpesa' ? 'border-turquoise bg-turquoise/5' : 'border-gray-200'
              }`}
            >
              <Smartphone className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium">M-Pesa</p>
                <p className="text-sm text-gray-500">Pay with your mobile money</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border rounded-lg flex items-center gap-3 ${
                paymentMethod === 'card' ? 'border-turquoise bg-turquoise/5' : 'border-gray-200'
              }`}
            >
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Pay with your card</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Payment Details */}
        {paymentMethod === 'mpesa' && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">M-Pesa Payment</h4>
            <div className="space-y-3">
              <Input
                placeholder="Phone Number (e.g., 0712345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  You will receive an M-Pesa prompt on your phone to complete the payment.
                </p>
              </div>
              {paymentStatus === 'pending' && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-blue-800">
                      Waiting for M-Pesa payment confirmation...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {paymentMethod === 'card' && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Card Payment</h4>
            <div className="space-y-3">
              <Input placeholder="Card Number" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="MM/YY" />
                <Input placeholder="CVV" />
              </div>
              <Input placeholder="Cardholder Name" />
            </div>
          </Card>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-turquoise hover:bg-turquoise/90 h-12 text-lg"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay KES ${trip?.fare || 850}`
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}