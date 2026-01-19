import React from 'react';
import { Users, UserPlus, ArrowRightLeft, CheckCircle2, MoreVertical } from 'lucide-react';
import { Card, CardHeader, Button, Badge } from './ui';

const SharedGroups = () => {
  const groups = [
    { id: 1, name: 'Main Street Roommates', members: 3, balance: -2500, status: 'You owe' },
    { id: 2, name: 'Kandy Trip 2025', members: 5, balance: 1200, status: 'You are owed' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 text-left">Shared Expense Groups</h1>
            <p className="text-gray-500 text-sm">Manage split bills and collaborative tracking with friends.</p>
          </div>
          <Button variant="primary" icon={UserPlus}>
            Create New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Group List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Groups</h3>
            {groups.map(group => (
              <Card key={group.id} className="p-5 hover:border-blue-300 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users size={20} />
                  </div>
                  <button className="text-gray-400"><MoreVertical size={16} /></button>
                </div>
                <h4 className="font-bold text-gray-800 mb-1 text-left">{group.name}</h4>
                <p className="text-xs text-gray-500 mb-4 text-left">{group.members} Members</p>
                <div className={`text-sm font-bold p-3 rounded-lg ${group.balance < 0 ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-600'}`}>
                  {group.status}: LKR {Math.abs(group.balance).toLocaleString()}
                </div>
              </Card>
            ))}
          </div>

          {/* Right Column: Detailed Breakdown (Fulfills Settlement & History Requirement) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <CardHeader icon={Users} title="Settle Balances: Main Street Roommates" />
                <Badge variant="default" size="sm">Group ID: #MS-001</Badge>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Settlement Item 1 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">KP</div>
                      <div className='text-left'>
                        <p className="text-sm font-bold text-gray-800">You owe Kasun Perera</p>
                        <p className="text-xs text-gray-500">For: Electricity Bill (Dec)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-red-400">LKR 2,500.00</p>
                      <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 ml-auto">
                        <CheckCircle2 size={12} /> Mark as Settled
                      </button>
                    </div>
                  </div>

                  {/* Settlement Item 2 */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">AM</div>
                      <div className='text-left'>
                        <p className="text-sm font-bold text-gray-800">Amali Mendis paid You</p>
                        <p className="text-xs text-gray-500">For: Grocery Split</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">LKR 1,200.00</p>
                      <span className="text-[10px] font-bold uppercase text-gray-400 italic">Settled History</span>
                    </div>
                  </div>
                </div>

                <Button variant="secondary" icon={ArrowRightLeft} className="w-full mt-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Add Shared Expense to this Group
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SharedGroups;