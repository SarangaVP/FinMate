import React from 'react';
import { User, Lock, Globe, Camera, ChevronRight, KeyRound, AlertCircle, Trash2 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 font-sans">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Identity & Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Summary */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
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
            </div>

            {/* Danger Zone - Fulfills Profile Control Requirement */}
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <AlertCircle size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Danger Zone</h3>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed mb-4">
                Deleting your account will permanently erase all your transaction history, shared group data, and saving goals.
              </p>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <Trash2 size={14} /> Delete My Account
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Details Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">Personal Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Full Name</label>
                    <input type="text" defaultValue="Saranga Malshan" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Default Currency</label>
                    <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none cursor-pointer appearance-none">
                        <option>LKR - Sri Lankan Rupee</option>
                        <option>USD - US Dollar</option>
                      </select>
                      <Globe size={14} className="absolute right-4 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Email Address</label>
                  <input type="email" defaultValue="saranga.malshan@example.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none" />
                </div>
              </div>
            </div>

            {/* Password Management */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                <KeyRound size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">Update Password</h3>
              </div>
              <div className="p-6 space-y-4">
                <input type="password" placeholder="Current Password" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="password" placeholder="New Password" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                  <input type="password" placeholder="Confirm New Password" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex justify-end pt-2">
                  <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;