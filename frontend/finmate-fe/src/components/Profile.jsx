import React, { useState, useEffect } from 'react';
import { User, Globe, Camera, KeyRound, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardHeader, Button, Input } from './ui';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'LKR'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data); // Debug log
        
        // Handle both naming conventions (name vs firstName/lastName)
        let firstName = data.firstName || '';
        let lastName = data.lastName || '';
        
        // If backend uses 'name' field, split it
        if (!firstName && data.name) {
          const nameParts = data.name.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        
        setProfileData({
          firstName: firstName,
          lastName: lastName,
          email: data.email || '',
          currency: data.currency || 'LKR'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage({ type: '', text: '' });

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred while updating password' });
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = () => {
    const first = profileData.firstName?.[0] || '';
    const last = profileData.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

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
                  {getInitials()}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-100 text-blue-600 hover:text-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h2>
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
              <button className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors">
                <Trash2 size={16} />
                Delete My Account
              </button>
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
                {message.text && (
                  <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="First Name" 
                    type="text" 
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    compact 
                  />
                  <Input 
                    label="Last Name" 
                    type="text" 
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    compact 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Email Address" 
                    type="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    compact 
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1">Default Currency</label>
                    <div className="relative">
                      <select 
                        name="currency"
                        value={profileData.currency}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="LKR">LKR - Sri Lankan Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                      <Globe size={14} className="absolute right-4 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Update Profile'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Password Management */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <CardHeader icon={KeyRound} title="Update Password" />
              </div>
              <div className="p-6 space-y-4">
                {passwordMessage.text && (
                  <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {passwordMessage.text}
                  </div>
                )}
                <Input 
                  type="password" 
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  compact 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    compact 
                  />
                  <Input 
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    compact 
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={handleUpdatePassword}
                    disabled={savingPassword}
                  >
                    {savingPassword ? 'Saving...' : 'Save Changes'}
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