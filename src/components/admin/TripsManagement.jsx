import React, { useState } from 'react';
import { MapPin, Eye } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockTrips, mockDrivers } from '../../lib/mockData';

export const TripsManagement = () => {
  const [filter, setFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const filteredTrips = mockTrips.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3>Trips Management</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trips</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="driving">In Progress</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrips.map((trip) => {
              const driver = mockDrivers.find(d => d.id === trip.driverId);
              const date = new Date(trip.createdAt);
              
              return (
                <TableRow key={trip.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{trip.id}</p>
                      <p className="text-xs text-gray-500">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{trip.pickup.address}</p>
                      <p className="text-xs text-gray-500 truncate">→ {trip.dropoff.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {driver ? (
                      <div>
                        <p className="text-sm">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicle.plate}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>KES {trip.fare.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          trip.status === 'completed' ? '#2AD7A1' :
                          trip.status === 'driving' ? '#0E1F40' :
                          '#FFA500',
                      }}
                    >
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          trip.paymentStatus === 'paid' ? '#2AD7A1' :
                          trip.paymentStatus === 'failed' ? '#FF0000' :
                          '#FFA500',
                      }}
                    >
                      {trip.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2>Trip Details</h2>
                <p className="text-sm text-gray-600 font-mono">{selectedTrip.id}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedTrip(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3">Trip Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: '#2AD7A1' }} />
                    <div className="flex-1">
                      <p className="text-sm">Pickup</p>
                      <p className="text-sm text-gray-600">{selectedTrip.pickup.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedTrip.createdAt && new Date(selectedTrip.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-dashed border-gray-300 h-8 ml-1.5" />
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#0E1F40' }} />
                    <div className="flex-1">
                      <p className="text-sm">Dropoff</p>
                      <p className="text-sm text-gray-600">{selectedTrip.dropoff.address}</p>
                      {selectedTrip.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(selectedTrip.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p>{selectedTrip.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p>{selectedTrip.duration} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fare</p>
                  <p>KES {selectedTrip.fare.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <Badge
                    style={{
                      backgroundColor: selectedTrip.paymentStatus === 'paid' ? '#2AD7A1' : '#FFA500',
                    }}
                  >
                    {selectedTrip.paymentStatus}
                  </Badge>
                </div>
              </div>

              {selectedTrip.driverId && (
                <div>
                  <h3 className="mb-3">Driver Information</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const driver = mockDrivers.find(d => d.id === selectedTrip.driverId);
                      return driver ? (
                        <div>
                          <p>{driver.name}</p>
                          <p className="text-sm text-gray-600">{driver.phone}</p>
                          <p className="text-sm text-gray-600">
                            {driver.vehicle.make} {driver.vehicle.model} - {driver.vehicle.plate}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">Driver information not available</p>
                      );
                    })()}
                  </div>
                </div>
              )}

              {selectedTrip.rating && (
                <div>
                  <h3 className="mb-3">Rating & Feedback</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="mb-2">Rating: {selectedTrip.rating} ⭐</p>
                    {selectedTrip.feedback && (
                      <p className="text-sm text-gray-600">{selectedTrip.feedback}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};