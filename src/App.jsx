import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/auth/AuthPage';
import PassengerHome from './components/passenger/PassengerHome';
import DriverDashboard from './components/driver/DriverDashboard';
import DriverEarnings from './components/driver/DriverEarnings';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  
  const handleTripRequest = () => {
    alert('Trip request simulation - this would show incoming trip requests');
  };
  
  const [currentView, setCurrentView] = useState('dashboard');
  
  const handleViewEarnings = () => {
    setCurrentView('earnings');
  };
  
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return <AuthPage />;
  
  switch(user.role) {
    case 'passenger':
      return <PassengerHome />;
    case 'driver':
      return currentView === 'earnings' ? 
        <DriverEarnings onBack={handleBackToDashboard} /> :
        <DriverDashboard onTripRequest={handleTripRequest} onViewEarnings={handleViewEarnings} />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <AuthPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}