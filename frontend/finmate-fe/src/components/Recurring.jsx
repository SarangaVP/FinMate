import React, { useState, useEffect } from 'react';
import { CalendarClock, BellRing, ArrowRight, RefreshCw, AlertCircle, X } from 'lucide-react';
import { Card, CardHeader, Button, Badge } from './ui';
import API from '../utils/api';

const Recurring = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paymentType: 'Subscription',
    frequency: 'Monthly',
    startDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await API.get('/recurring');
      setSubscriptions(response.data.data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await API.post('/recurring/add', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      setShowModal(false);
      setFormData({ description: '', amount: '', paymentType: 'Subscription', frequency: 'Monthly', startDate: '' });
      fetchPayments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add payment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusVariant = (nextDueDate) => {
    const daysUntilDue = Math.ceil((new Date(nextDueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 3) return 'danger';
    return 'default';
  };

  const getStatusText = (nextDueDate) => {
    const daysUntilDue = Math.ceil((new Date(nextDueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 0) return 'Overdue';
    if (daysUntilDue <= 3) return 'Due Soon';
    if (daysUntilDue <= 7) return 'Upcoming';
    return 'Scheduled';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
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
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-gray-500">No recurring payments yet.</p>
            ) : (
              subscriptions.map(sub => (
                <Card 
                  key={sub._id} 
                  className="p-5 flex items-center justify-between group hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <RefreshCw size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">{sub.description}</h4>
                      <p className="text-xs text-gray-500">Next payment: {formatDate(sub.nextDueDate)} • {sub.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-gray-800 font-mono">LKR {sub.amount.toLocaleString()}</p>
                      <Badge variant={getStatusVariant(sub.nextDueDate)} size="xs">
                        {getStatusText(sub.nextDueDate)}
                      </Badge>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </Card>
              ))
            )}
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
                  <span className="text-xl font-bold text-gray-800 font-mono">
                    LKR {subscriptions.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </span>
                  <BellRing size={24} className="text-blue-200" />
                </div>
              </div>
            </Card>

            <Button variant="dark" size="xl" className="w-full" onClick={() => setShowModal(true)}>
              Add New Subscription
            </Button>
          </div>

        </div>
      </div>

      {/* Add Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Recurring Payment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Netflix Subscription"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Amount (LKR)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Payment Type</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Subscription">Subscription</option>
                  <option value="Utility">Utility</option>
                  <option value="Rent">Rent</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button type="submit" variant="dark" size="xl" className="w-full" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Payment'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recurring;