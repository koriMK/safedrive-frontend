import { useState, useEffect } from 'react';
import { Car, DollarSign, MapPin, TrendingUp, LogOut, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import TripRequestModal from './TripRequestModal';
import DocumentUpload from './DocumentUpload';
import NairobiMap from '../NairobiMap';

export default function DriverDashboard({ onTripRequest, onViewEarnings }) {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [showTripRequest, setShowTripRequest] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [driverData, setDriverData] = useState(null);
  const [stats, setStats] = useState({ todayEarnings: 0, todayTrips: 0 });
  
  useEffect(() => {
    if (user?.id) {
      fetchDriverData();
    }
  }, [user]);
  
  const fetchDriverData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get driver profile
      const profileResponse = await fetch(`${API_BASE_URL}/drivers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setDriverData(profileData.data);
      }
      
      // Get driver earnings
      const earningsResponse = await fetch(`${API_BASE_URL}/drivers/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setStats({
          todayEarnings: earningsData.data.todayEarnings || 0,
          todayTrips: earningsData.data.todayTrips || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch driver data:', error);
      // Set default values if API fails
      setDriverData({
        status: 'approved',
        totalTrips: 0,
        rating: 0,
        vehicle: { plate: 'KCA 123A' }
      });
      setStats({ todayEarnings: 0, todayTrips: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback style={{ backgroundColor: '#0E1F40', color: 'white' }}>
                {user?.name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p>{user?.name}</p>
                {driverData?.status === 'approved' && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{driverData?.vehicle?.plate || 'No vehicle'}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Online/Offline Toggle */}
        <div 
          className="flex items-center justify-between p-4 rounded-lg" 
          style={{ backgroundColor: isOnline ? '#2AD7A1' : '#e5e7eb' }}
        >
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-white" />
            <span className={isOnline ? 'text-white' : 'text-gray-600'}>
              {isOnline ? 'You are online' : 'You are offline'}
            </span>
          </div>
          <Switch
            checked={isOnline}
            onCheckedChange={async (checked) => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/drivers/status`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ isOnline: checked })
                });
                
                const data = await response.json();
                
                if (data.success) {
                  setIsOnline(checked);
                  console.log('Driver status saved to database:', checked ? 'online' : 'offline');
                } else {
                  console.error('Failed to update status:', data.error?.message);
                }
              } catch (error) {
                console.error('Failed to update driver status:', error);
              }
            }}
            className="data-[state=checked]:bg-white"
          />
        </div>

        {/* Map Area - Hidden when showing documents */}
        {!showDocuments && (
          <div className="mt-4">
            <div className="h-64 rounded-lg overflow-hidden">
              <NairobiMap />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" style={{ color: '#2AD7A1' }} />
              <span className="text-sm text-gray-600">Today's Earnings</span>
            </div>
            <p className="text-2xl">KES {stats.todayEarnings.toLocaleString()}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4" style={{ color: '#0E1F40' }} />
              <span className="text-sm text-gray-600">Trips Today</span>
            </div>
            <p className="text-2xl">{stats.todayTrips}</p>
          </Card>
        </div>

        {/* Overall Stats */}
        <Card className="p-4">
          <h3 className="mb-4">Overall Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Trips</p>
              <p className="text-xl">{driverData?.totalTrips || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-xl">{driverData?.rating || 0} ⭐</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-xl">42 trips</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Acceptance</p>
              <p className="text-xl">95%</p>
            </div>
          </div>
        </Card>



        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={onViewEarnings}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Earnings</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => setShowDocuments(true)}
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm">Documents</span>
          </Button>
        </div>

        {/* Check for Available Trips */}
        {isOnline && (
          <Button
            className="w-full"
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/trips/available`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                  setShowTripRequest(true);
                  console.log('Available trips:', data.data);
                } else {
                  alert('No trip requests available at the moment');
                }
              } catch (error) {
                console.error('Failed to check for trips:', error);
                alert('Failed to check for available trips');
              }
            }}
            style={{ backgroundColor: '#2AD7A1' }}
          >
            Check for Trip Requests
          </Button>
        )}
      </div>
      
      {/* Trip Request Modal */}
      {showTripRequest && (
        <TripRequestModal
          onAccept={() => {
            setShowTripRequest(false);
            alert('Trip accepted! Navigation would start here.');
          }}
          onReject={() => setShowTripRequest(false)}
        />
      )}
      
      {/* Document Upload */}
      {showDocuments && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <DocumentUpload onBack={() => setShowDocuments(false)} />
        </div>
      )}
    </div>
  );
}