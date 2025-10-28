import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Smartphone } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5002/api/v1';

export default function DriverEarnings({ onBack }) {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutStep, setPayoutStep] = useState('request');
  const [earnings, setEarnings] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
    fetchTrips();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/drivers/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setEarnings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/trips?status=completed&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTrips(data.data.trips);
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  const handleRequestPayout = async () => {
    setPayoutStep('processing');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/drivers/payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: earnings?.totalEarnings || 0,
          phone: '+254723456789'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPayoutStep('success');
        setTimeout(() => {
          setShowPayoutModal(false);
          setPayoutStep('request');
          toast.success('Payout request sent successfully!');
        }, 2000);
      } else {
        throw new Error(data.error?.message || 'Payout failed');
      }
    } catch (error) {
      toast.error('Payout request failed');
      setPayoutStep('request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  const totalBalance = earnings?.totalEarnings || 0;
  const todayEarnings = earnings?.todayEarnings || 0;
  const weekEarnings = earnings?.weekEarnings || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>Earnings</h1>
      </div>

      <div className="p-4">
        <Card className="p-6 bg-gradient-to-br from-[#0E1F40] to-[#1a3a5c] text-white">
          <p className="text-sm opacity-90 mb-2">Available Balance</p>
          <h2 className="text-4xl mb-4">KES {totalBalance.toLocaleString()}</h2>
          <Button
            className="w-full bg-white hover:bg-gray-100"
            style={{ color: '#0E1F40' }}
            onClick={() => setShowPayoutModal(true)}
          >
            Request Payout
          </Button>
        </Card>
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <p className="text-xl">KES {todayEarnings.toLocaleString()}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">This Week</span>
            </div>
            <p className="text-xl">KES {weekEarnings.toLocaleString()}</p>
          </Card>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4 space-y-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{new Date(trip.createdAt).toLocaleTimeString()}</p>
                    <p className="text-xs text-gray-400">{new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg">KES {trip.fare}</p>
                    <Badge className="text-xs" style={{ backgroundColor: '#2AD7A1' }}>
                      {trip.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">{trip.pickup.address} → {trip.dropoff.address}</p>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="week" className="mt-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">Weekly summary</p>
              <p className="text-sm text-gray-500 mt-1">42 trips completed</p>
            </div>
          </TabsContent>

          <TabsContent value="month" className="mt-4">
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">Monthly summary</p>
              <p className="text-sm text-gray-500 mt-1">168 trips completed</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            {payoutStep === 'request' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2AD7A1' }}>
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-2">Request Payout</h2>
                  <p className="text-sm text-gray-600">
                    Your earnings will be sent to your M-Pesa
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Available Balance</span>
                    <span className="text-2xl">KES {totalBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">M-Pesa Number</span>
                    <span>+254723456789</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleRequestPayout}
                    style={{ backgroundColor: '#2AD7A1' }}
                  >
                    Confirm Payout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPayoutModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {payoutStep === 'processing' && (
              <div className="text-center py-8">
                <Smartphone className="w-16 h-16 mx-auto mb-4 animate-pulse" style={{ color: '#2AD7A1' }} />
                <h2 className="mb-2">Processing Payout</h2>
                <p className="text-gray-600">Sending to M-Pesa...</p>
              </div>
            )}

            {payoutStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2AD7A1' }}>
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-2">Payout Sent!</h2>
                <p className="text-gray-600">Check your M-Pesa for confirmation</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}