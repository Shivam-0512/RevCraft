import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { SaveIcon, UserIcon, BuildingIcon, MapPinIcon, KeyIcon } from 'lucide-react';
const Profile = () => {
  const [profile, setProfile] = useState({
    shopName: 'AutoMods India',
    ownerName: 'Vikram Mehta',
    email: 'vikram@automods.in',
    phone: '+91 98765 43210',
    gstNumber: 'GST1234567890',
    address: '123 Garage Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX-XXXX-1234',
    ifscCode: 'HDFC0001234'
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('business');
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Updated profile:', profile);
    alert('Profile updated successfully!');
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    console.log('Password change:', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  return <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Seller Profile
          </h1>
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-700">
              <nav className="flex -mb-px">
                <button onClick={() => setActiveTab('business')} className={`${activeTab === 'business' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}>
                  <BuildingIcon className="h-5 w-5 mr-2" />
                  Business Information
                </button>
                <button onClick={() => setActiveTab('address')} className={`${activeTab === 'address' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}>
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Address & Banking
                </button>
                <button onClick={() => setActiveTab('password')} className={`${activeTab === 'password' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}>
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Change Password
                </button>
              </nav>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {/* Business Information */}
              {activeTab === 'business' && <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="shopName" className="block text-sm font-medium text-gray-300">
                        Shop Name
                      </label>
                      <div className="mt-1">
                        <input type="text" name="shopName" id="shopName" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.shopName} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-300">
                        Owner Name
                      </label>
                      <div className="mt-1">
                        <input type="text" name="ownerName" id="ownerName" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.ownerName} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input type="email" name="email" id="email" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.email} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input type="tel" name="phone" id="phone" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.phone} onChange={handleProfileChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-300">
                        GST Number
                      </label>
                      <div className="mt-1">
                        <input type="text" name="gstNumber" id="gstNumber" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.gstNumber} onChange={handleProfileChange} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>}
              {/* Address & Banking */}
              {activeTab === 'address' && <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Address Information
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                          Street Address
                        </label>
                        <div className="mt-1">
                          <input type="text" name="address" id="address" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.address} onChange={handleProfileChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                          City
                        </label>
                        <div className="mt-1">
                          <input type="text" name="city" id="city" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.city} onChange={handleProfileChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-300">
                          State
                        </label>
                        <div className="mt-1">
                          <select id="state" name="state" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.state} onChange={handleProfileChange}>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Gujarat">Gujarat</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-300">
                          Pincode
                        </label>
                        <div className="mt-1">
                          <input type="text" name="pincode" id="pincode" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.pincode} onChange={handleProfileChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Banking Details
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-300">
                          Bank Name
                        </label>
                        <div className="mt-1">
                          <input type="text" name="bankName" id="bankName" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.bankName} onChange={handleProfileChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300">
                          Account Number
                        </label>
                        <div className="mt-1">
                          <input type="text" name="accountNumber" id="accountNumber" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.accountNumber} onChange={handleProfileChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-300">
                          IFSC Code
                        </label>
                        <div className="mt-1">
                          <input type="text" name="ifscCode" id="ifscCode" className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={profile.ifscCode} onChange={handleProfileChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>}
              {/* Change Password */}
              {activeTab === 'password' && <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input type="password" name="currentPassword" id="currentPassword" required className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input type="password" name="newPassword" id="newPassword" required className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input type="password" name="confirmPassword" id="confirmPassword" required className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white py-2 px-3" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                  </div>
                </form>}
            </div>
          </div>
        </main>
      </div>
    </div>;
};
export default Profile;