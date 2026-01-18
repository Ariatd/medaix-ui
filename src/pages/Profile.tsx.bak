import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    phone: currentUser?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      phone: currentUser?.phone || '',
    });
    setIsEditing(false);
    setError(null);
  };

  const handleAvatarUpload = () => {
    // In real app, upload to server
    // For now, just show message
    setSuccess('Avatar updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const memberSinceDate = currentUser?.memberSince
    ? new Date(currentUser.memberSince).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Mock recent analyses
  const recentAnalyses = [
    { id: 1, type: 'Brain MRI', date: '2025-12-10', confidence: 87 },
    { id: 2, type: 'Chest X-Ray', date: '2025-12-08', confidence: 92 },
    { id: 3, type: 'Lung CT', date: '2025-12-05', confidence: 85 },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6 px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">User Profile</h1>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Manage your account settings and profile information</p>
          </div>

          {/* Success Alert - Responsive */}
          {success && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-green-800 bg-green-900/30 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-300 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-green-200">{success}</p>
            </div>
          )}

          {/* Error Alert - Responsive */}
          {error && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-red-800 bg-red-900/30 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-red-300 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Main Content - 2 Column Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN (Narrow - 1 col) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Avatar Card - Portrait/Vertical */}
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col">
                <div className="text-center flex-1">
                  <img
                    src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=0066CC&color=fff'}
                    alt="Avatar"
                    className="mx-auto h-24 w-24 rounded-lg object-cover shadow-md"
                  />
                  <label className="mt-4 block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
                      className="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Upload Avatar
                    </button>
                  </label>
                </div>
                <div className="mt-6 space-y-3 border-t border-gray-700 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Member Since</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{memberSinceDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Account Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to log out?')) {
                      logout();
                    }
                  }}
                  className="mt-6 w-full rounded-lg border-2 border-red-700 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-900/30"
                >
                  Logout
                </button>
              </div>

              {/* Token Status Card - Same narrow width */}
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
                {/* Bonus Tokens */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-900/30 rounded-md">
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bonus Tokens Remaining</p>
                      <p className="text-xs text-gray-700 dark:text-gray-400">8 / 15 tokens</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">60%</span>
                </div>
                <div className="mt-3 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '60%' }} />
                </div>

                {/* Daily Free Analyses */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-900/30 rounded-md">
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Daily Free Analyses</p>
                        <p className="text-xs text-gray-700 dark:text-gray-400">2 / 3 used today</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-100">66%</span>
                  </div>
                  <div className="mt-3 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{ width: '66%' }} />
                  </div>
                </div>

                {/* Upgrade Link */}
                <div className="mt-4 text-sm text-gray-900 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Running low on tokens? <button type="button" onClick={() => setShowUpgradeModal(true)} className="text-primary-600 dark:text-primary-400 hover:underline">Upgrade to Pro for unlimited analyses</button></span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (Wider - 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information Card */}
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="rounded-lg bg-gray-700/60 px-4 py-2 font-semibold text-gray-100 transition hover:bg-gray-700"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Plan Card */}
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary-900/30 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-3.866-3.582-7-8-7v14c4.418 0 8-3.134 8-7zM22 11c0-3.866-3.582-7-8-7v14c4.418 0 8-3.134 8-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-300 uppercase">CURRENT PLAN</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary-900/30 px-3 py-1 text-sm font-semibold text-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
                        </svg>
                        Beginner Plan
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-gray-900 dark:text-gray-300">
                      <li>• 15 bonus tokens on signup</li>
                      <li>• 3 daily analyses after tokens depleted</li>
                      <li>• Basic support</li>
                    </ul>
                    <div className="mt-4">
                      <button type="button" onClick={() => setShowUpgradeModal(true)} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">Upgrade to Pro</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Plan Card */}
              <div className="rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] p-6 shadow-2xl ring-1 ring-white/8 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-white/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase">PRO PLAN</p>
                    <h3 className="mt-2 text-xl font-bold">Unlock Pro Features</h3>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li>• Unlimited analyses</li>
                      <li>• Priority processing</li>
                      <li>• Advanced AI models</li>
                      <li>• Export reports as PDF</li>
                      <li>• Real doctor feedback</li>
                      <li>• Supports psychology & psychiatry fields</li>
                    </ul>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">$9.99<span className="text-sm font-medium">/month</span></p>
                      </div>
                      <button type="button" onClick={() => setShowUpgradeModal(true)} className="px-4 py-2 rounded-lg bg-white text-primary-700 font-semibold hover:opacity-95 transition">Upgrade Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal - Responsive */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-gray-800/90 p-4 sm:p-6 lg:p-8 shadow-2xl ring-1 ring-white/6">
            <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-100">Change Password</h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-300">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-600 bg-gray-900/40 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm text-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-300">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-600 bg-gray-900/40 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm text-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-600 bg-gray-900/40 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm text-gray-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg bg-primary px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-blue-700 text-xs sm:text-sm"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border-2 border-gray-600 px-3 sm:px-4 py-2 font-semibold text-gray-200 transition hover:bg-gray-700/40 text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Upgrade Modal - Visual Only */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white/5 dark:bg-gray-900/90 p-6 shadow-2xl ring-1 ring-white/6 relative">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 - Current Plan */}
              <div className="rounded-lg bg-gray-800/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-300 uppercase">Current Plan</p>
                    <h3 className="mt-2 text-lg font-bold text-gray-100">Beginner Plan</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-800/30 px-3 py-1 text-sm font-semibold text-green-300">
                    ✓ Current
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  <li>• 15 bonus tokens on signup</li>
                  <li>• 3 daily analyses after tokens depleted</li>
                  <li>• Basic support</li>
                </ul>
              </div>

              {/* Column 2 - Pro Plan */}
              <div className="rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase">Pro Plan</p>
                    <h3 className="mt-2 text-lg font-bold">Pro — $9.99 / month</h3>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm">
                  <li>• Unlimited analyses</li>
                  <li>• Priority processing</li>
                  <li>• Advanced AI models</li>
                  <li>• Export reports as PDF</li>
                  <li>• Real doctor feedback</li>
                  <li>• Supports psychology & psychiatry fields</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 rounded-lg border border-gray-600 text-gray-200">Close</button>
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white font-semibold">Proceed to Payment</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
