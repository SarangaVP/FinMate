import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Card } from './ui';

const SettlePaymentModal = ({ isOpen, onClose, settlement, onSubmit, loading, currency = 'USD' }) => {
  const [paymentAmount, setPaymentAmount] = useState(settlement?.amount || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (amount > settlement.amount) {
      alert(`Payment amount cannot exceed ${settlement.amount.toFixed(2)}`);
      return;
    }

    onSubmit(amount);
    setPaymentAmount('');
  };

  if (!isOpen || !settlement) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Make Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Payment To</p>
              <p className="font-bold text-gray-800">{settlement.payeeId?.name || settlement.payeeId?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Outstanding</p>
              <p className="font-bold text-lg text-gray-800">{currency} {settlement.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Amount *
            </label>
            <div className="flex items-center">
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-l-lg font-semibold">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={settlement.amount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Max: {currency} {settlement.amount.toFixed(2)}
            </p>
          </div>

          {paymentAmount && parseFloat(paymentAmount) < settlement.amount && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Partial Payment:</strong> Remaining balance will be {currency} {(settlement.amount - parseFloat(paymentAmount)).toFixed(2)}
              </p>
            </div>
          )}

          {paymentAmount && parseFloat(paymentAmount) >= settlement.amount && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>Full Settlement:</strong> This payment will complete the settlement
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !paymentAmount}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettlePaymentModal;
