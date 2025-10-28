import React, { useState } from 'react';
import { Download, DollarSign, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockPayments, mockTrips } from '../../lib/mockData';
import { toast } from 'sonner';

export const PaymentsManagement = () => {
  const [filter, setFilter] = useState('all');

  const filteredPayments = mockPayments.filter(p => 
    filter === 'all' ? true : p.status === filter
  );

  const totalRevenue = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRefund = (paymentId) => {
    toast.success('Refund initiated successfully');
  };

  const handleExport = () => {
    toast.success('Exporting payments data...');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" style={{ color: '#2AD7A1' }} />
            <span className="text-gray-600">Total Revenue</span>
          </div>
          <p className="text-3xl">KES {totalRevenue.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Successful Payments</span>
          </div>
          <p className="text-3xl">{mockPayments.filter(p => p.status === 'paid').length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            <span className="text-gray-600">Failed Payments</span>
          </div>
          <p className="text-3xl">{mockPayments.filter(p => p.status === 'failed').length}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3>M-Pesa Payments</h3>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Trip ID</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => {
              const date = new Date(payment.createdAt);
              
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="font-mono text-sm">{payment.id}</p>
                    {payment.checkoutRequestId && (
                      <p className="text-xs text-gray-500 font-mono">
                        {payment.checkoutRequestId}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-sm">{payment.tripId}</p>
                  </TableCell>
                  <TableCell>{payment.phone}</TableCell>
                  <TableCell>
                    <p>KES {payment.amount.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          payment.status === 'paid' ? '#2AD7A1' :
                          payment.status === 'failed' ? '#FF0000' :
                          '#FFA500',
                      }}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{date.toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{date.toLocaleTimeString()}</p>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefund(payment.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2AD7A1' }}>
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">M-Pesa Daraja API Integration</h3>
            <p className="text-sm text-gray-700 mb-3">
              All payments are processed securely through Safaricom's M-Pesa Daraja API using STK Push. 
              Transactions are verified in real-time and customers receive instant confirmations.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Success Rate</p>
                <p className="text-lg">98.5%</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Avg Processing Time</p>
                <p className="text-lg">8 seconds</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Today's Transactions</p>
                <p className="text-lg">247</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};