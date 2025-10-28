import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Car, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup({ onToggleLogin }) {
  const { signup, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'passenger',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling signup function...');
      const result = await signup(formData);
      console.log('Signup successful:', result);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0E1F40 0%, #1a3a5c 100%)' }}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#0E1F40] to-[#2AD7A1] rounded-3xl flex items-center justify-center shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription className="text-base">
            Join SafeDrive and experience safe rides home
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <Input
                id="name"
                placeholder="John Kamau"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 712 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
                className="h-11"
              />
              <p className="text-xs text-gray-500 mt-1">Required for M-Pesa payments</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm">Account Type</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#2AD7A1] transition-colors cursor-pointer">
                  <RadioGroupItem value="passenger" id="passenger" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="passenger" className="cursor-pointer">
                      <div className="text-sm">Passenger</div>
                      <div className="text-xs text-gray-500 mt-0.5">Request verified drivers for safe rides</div>
                    </Label>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#2AD7A1] transition-colors cursor-pointer">
                  <RadioGroupItem value="driver" id="driver" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="driver" className="cursor-pointer">
                      <div className="text-sm">Driver</div>
                      <div className="text-xs text-gray-500 mt-0.5">Earn money by providing safe driving services</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-6"
              disabled={isLoading}
              style={{ backgroundColor: '#0E1F40' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={onToggleLogin}
            style={{ borderColor: '#2AD7A1', color: '#0E1F40' }}
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}