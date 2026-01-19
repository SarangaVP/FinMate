import React from 'react';
import { User, Globe, Camera, KeyRound, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardHeader, Button, Input } from './ui';

const Profile = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 font-sans">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Identity & Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Summary */}
            <Card className="p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-linear-to-tr from-blue-600 to-blue-800 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  SM
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-100 text-blue-600 hover:text-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Saranga Malshan</h2>
              <p className="text-xs text-gray-400 mb-4 font-medium uppercase">Standard Account</p>
              <p className="text-[11px] text-gray-500 leading-relaxed px-4">
                Managing personal and shared finances since Dec 2025.
              </p>
            </Card>

            {/* Danger Zone - Fulfills Profile Control Requirement */}
            <Card className="p-6 bg-red-50 border-red-100">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <AlertCircle size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Danger Zone</h3>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed mb-4">
                Deleting your account will permanently erase all your transaction history, shared group data, and saving goals.
              </p>
              <Button variant="danger" size="md" icon={Trash2} className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white">
                Delete My Account
              </Button>
            </Card>
          </div>

          {/* RIGHT COLUMN: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Details Form */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <CardHeader icon={User} title="Personal Information" />
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Full Name" 
                    type="text" 
                    defaultValue="Saranga Malshan" 
                    compact 
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1">Default Currency</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-blue-100">
                        <option>LKR - Sri Lankan Rupee</option>
                        <option>USD - US Dollar</option>
                      </select>
                      <Globe size={14} className="absolute right-4 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <Input 
                  label="Email Address" 
                  type="email" 
                  defaultValue="saranga.malshan@example.com" 
                  compact 
                />
              </div>
            </Card>

            {/* Password Management */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <CardHeader icon={KeyRound} title="Update Password" />
              </div>
              <div className="p-6 space-y-4">
                <Input 
                  type="password" 
                  placeholder="Current Password" 
                  compact 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    type="password" 
                    placeholder="New Password" 
                    compact 
                  />
                  <Input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    compact 
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="md">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;