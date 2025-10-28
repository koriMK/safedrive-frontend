import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Star, Car } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5002/api/v1';

export const DriversManagement = () => {
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/drivers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const filteredDrivers = filter === 'all' ? data.data.drivers : data.data.drivers.filter(d => d.status === filter);
        setDrivers(filteredDrivers);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (driverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Driver approved successfully');
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (error) {
      toast.error('Failed to approve driver');
    }
  };

  const handleReject = async (driverId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/drivers/${driverId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Application rejected' }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Driver rejected');
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (error) {
      toast.error('Failed to reject driver');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3>Drivers Management</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Trips</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback style={{ backgroundColor: '#0E1F40', color: 'white' }}>
                        {driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{driver.vehicle.make} {driver.vehicle.model}</p>
                    <p className="text-xs text-gray-500">{driver.vehicle.plate}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {driver.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>{driver.totalTrips}</TableCell>
                <TableCell>
                  <Badge
                    style={{
                      backgroundColor:
                        driver.status === 'approved'
                          ? '#2AD7A1'
                          : driver.status === 'pending'
                          ? '#FFA500'
                          : '#gray',
                    }}
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDriver(driver)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {driver.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          style={{ backgroundColor: '#2AD7A1' }}
                          onClick={() => handleApprove(driver.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleReject(driver.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback style={{ backgroundColor: '#0E1F40', color: 'white' }}>
                    {selectedDriver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2>{selectedDriver.name}</h2>
                  <p className="text-sm text-gray-600">{selectedDriver.email}</p>
                  <p className="text-sm text-gray-600">{selectedDriver.phone}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setSelectedDriver(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Make & Model</p>
                    <p>{selectedDriver.vehicle.make} {selectedDriver.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p>{selectedDriver.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plate Number</p>
                    <p>{selectedDriver.vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p>{selectedDriver.vehicle.color}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Performance</h3>
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Trips</p>
                    <p className="text-2xl">{selectedDriver.totalTrips}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl">{selectedDriver.rating || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge
                      style={{
                        backgroundColor:
                          selectedDriver.status === 'approved' ? '#2AD7A1' : '#FFA500',
                      }}
                    >
                      {selectedDriver.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedDriver.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: '#2AD7A1' }}
                    onClick={() => handleApprove(selectedDriver.id)}
                  >
                    Approve Driver
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200"
                    onClick={() => handleReject(selectedDriver.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};