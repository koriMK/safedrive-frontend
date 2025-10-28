import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Users, Car, DollarSign, TrendingUp, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, passengers: 0, drivers: 0 },
    trips: { total: 0, today: 0, thisWeek: 0 },
    revenue: { total: 0, today: 0, thisMonth: 0 },
    drivers: { online: 0, approved: 0, pending: 0 }
  });
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Load stats
      try {
        const statsRes = await fetch('http://localhost:5002/api/v1/admin/stats', { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.log('Stats API not available, using defaults');
      }
      
      // Load drivers
      try {
        const driversRes = await fetch('http://localhost:5002/api/v1/admin/drivers', { headers });
        if (driversRes.ok) {
          const driversData = await driversRes.json();
          if (driversData.success) {
            const pending = driversData.data.drivers.filter(d => d.status === 'pending');
            setPendingDrivers(pending);
          }
        }
      } catch (error) {
        console.log('Drivers API not available');
      }
      
      // Load trips
      try {
        const tripsRes = await fetch('http://localhost:5002/api/v1/admin/trips', { headers });
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          if (tripsData.success) {
            setRecentTrips(tripsData.data.trips.slice(0, 10));
          }
        }
      } catch (error) {
        console.log('Trips API not available');
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };
  
  const approveDriver = async (driverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/api/v1/admin/drivers/${driverId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Driver approved and saved to database!');
        loadDashboardData(); // Refresh the list
      } else {
        alert(data.error?.message || 'Failed to approve driver');
      }
    } catch (error) {
      console.error('Failed to approve driver:', error);
      alert('Failed to approve driver');
    }
  };
  
  const suspendDriver = async (driverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5002/api/v1/admin/drivers/${driverId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Driver rejected and saved to database!');
        loadDashboardData(); // Refresh the list
      } else {
        alert(data.error?.message || 'Failed to reject driver');
      }
    } catch (error) {
      console.error('Failed to reject driver:', error);
      alert('Failed to reject driver');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Car className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">SafeDrive Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>Hello, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.users.total}</p>
                  <p className="text-xs text-gray-500">
                    {stats.users.passengers} passengers, {stats.users.drivers} drivers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold">{stats.trips.total}</p>
                  <p className="text-xs text-gray-500">
                    {stats.trips.today} today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-turquoise" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">KSh {(stats.revenue?.total || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    KSh {(stats.revenue?.today || 0).toLocaleString()} today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Online Drivers</p>
                  <p className="text-2xl font-bold">{stats.drivers.online}</p>
                  <p className="text-xs text-gray-500">
                    {stats.drivers.pending} pending approval
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Driver Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Management ({pendingDrivers.length} pending)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDrivers.length > 0 ? (
                pendingDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{driver.user?.name || 'Unknown Driver'}</h3>
                      <p className="text-sm text-gray-600">{driver.user?.email}</p>
                      <p className="text-sm text-gray-600">
                        {driver.vehicle?.make} {driver.vehicle?.model} - {driver.vehicle?.plate}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          driver.documents?.idCard ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          ID Card {driver.documents?.idCard ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          driver.documents?.license ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          License {driver.documents?.license ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          driver.documents?.insurance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Insurance {driver.documents?.insurance ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-turquoise hover:bg-turquoise/90"
                        onClick={() => approveDriver(driver.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => suspendDriver(driver.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending driver approvals</p>
                  <p className="text-sm">Drivers will appear here when they register and upload documents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">New driver registration</p>
                  <p className="text-sm text-gray-600">John Kamau registered as a driver</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Trip completed</p>
                  <p className="text-sm text-gray-600">Westlands to Karen (KES 850)</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Payment processed</p>
                  <p className="text-sm text-gray-600">M-Pesa payment of KES 850</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}