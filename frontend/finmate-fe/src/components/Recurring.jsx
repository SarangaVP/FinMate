import React from 'react';
import { CalendarClock, BellRing, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardHeader, Button, Badge } from './ui';

const Recurring = () => {
  const subscriptions = [
    { id: 1, name: 'Netflix Subscription', amount: 2200, date: 'Jan 05', frequency: 'Monthly', status: 'Upcoming' },
    { id: 2, name: 'Apartment Rent', amount: 45000, date: 'Jan 01', frequency: 'Monthly', status: 'Due Soon' },
    { id: 3, name: 'Dialog Home Broadband', amount: 3500, date: 'Jan 12', frequency: 'Monthly', status: 'Scheduled' },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Due Soon': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Recurring Payments</h1>
            <p className="text-gray-500 text-sm">Manage your subscriptions and repetitive bills automatically.</p>
          </div>
          <Button variant="secondary" icon={CalendarClock}>
            View Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Upcoming Reminders List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-left">Upcoming This Month</h3>
            {subscriptions.map(sub => (
              <Card 
                key={sub.id} 
                className="p-5 flex items-center justify-between group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <RefreshCw size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800">{sub.name}</h4>
                    <p className="text-xs text-gray-500">Next payment: {sub.date} • {sub.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-800 font-mono">LKR {sub.amount.toLocaleString()}</p>
                    <Badge variant={getStatusVariant(sub.status)} size="xs">
                      {sub.status}
                    </Badge>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* 2. AI Budget Impact (Proactive Planning) */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader icon={AlertCircle} title="Payment Alert" iconColor="text-amber-500" />
              <p className="text-sm text-gray-600 leading-relaxed text-left mb-6">
                Your Apartment Rent is due in 3 days. We've reserved LKR 45,000 from your 'In My Pocket' balance to cover this.
              </p>
              <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 text-left">Reserved for Bills</p>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold text-gray-800 font-mono">LKR 50,700</span>
                  <BellRing size={24} className="text-blue-200" />
                </div>
              </div>
            </Card>

            <Button variant="dark" size="xl" className="w-full">
              Add New Subscription
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Recurring;