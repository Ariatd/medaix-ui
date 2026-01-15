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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#071029] text-gray-900 dark:text-gray-100 ring-1 ring-black/5 dark:ring-white/6 px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">User Profile</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your account settings and profile information</p>
          </div>

          {success && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-success bg-success-50 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-success mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-success">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-danger bg-danger-50 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-danger mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 lg:p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
                <div className="mb-4 sm:mb-6 text-center">
                  <img
                    src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=0066CC&color=fff'}
                    alt="Avatar"
                    className="mx-auto h-24 w-24 sm:h-32 sm:w-32 rounded-lg object-cover shadow-md"
                  />
                  <label className="mt-3 sm:mt-4 block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
                      className="rounded-lg bg-primary-600 hover:bg-primary-700 px-3 sm:px-4 py-2 font-semibold text-white transition text-xs sm:text-sm"
                    >
                      Upload Avatar
                    </button>
                  </label>
                </div>

                <div className="space-y-3 sm:space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Member Since</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{memberSinceDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Account Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Active</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to log out?')) {
                      logout();
                    }
                  }}
                  className="mt-4 sm:mt-6 w-full rounded-lg border-2 border-danger-600 px-3 sm:px-4 py-2 font-semibold text-danger-600 dark:text-danger-400 transition hover:bg-danger-50 dark:hover:bg-danger-900/20 text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>

              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">Token Status</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Bonus Tokens</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">8/15</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-primary" style={{ width: '53%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Daily Analyses</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">2/3</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-full rounded-full bg-success" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 lg:p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-lg bg-primary-600 hover:bg-primary-700 px-3 sm:px-4 py-2 font-semibold text-white transition text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-success-600 hover:bg-success-700 px-3 sm:px-4 py-2 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Full Name</p>
                      <p className="mt-1 text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">{currentUser?.name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</p>
                      <p className="mt-1 text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">{currentUser?.email}</p>
                    </div>

                    {formData.bio && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Bio</p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{formData.bio}</p>
                      </div>
                    )}

                    {formData.phone && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone</p>
                        <p className="mt-1 text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">{formData.phone}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 sm:px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 transition text-xs sm:text-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-white dark:bg-gray-800/80 p-4 sm:p-6 lg:p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 transition hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/30">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Current Plan</h2>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    15 bonus tokens on signup
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3 daily analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic support
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-4 sm:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h3 className="text-lg font-bold text-white">PRO PLAN</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-white/90 mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority processing
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    .PDF support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced AI models
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Psychology & Psychiatry Analyze tech
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real doctor feedback
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">$9.99 / month</span>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#6366F1] transition hover:bg-gray-100"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Change Password</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 rounded-lg bg-primary-600 hover:bg-primary-700 px-3 sm:px-4 py-2 font-semibold text-white transition text-xs sm:text-sm"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-gray-100 dark:bg-gray-700/50 p-6 border-2 border-gray-200 dark:border-gray-600">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Free Plan</h3>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      15 bonus tokens on signup
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      3 daily analyses
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic support
                    </li>
                  </ul>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$0 / month</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-xl font-bold">PRO PLAN</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-white/90 mb-6">
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      30 bonus tokens on signup
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      10 daily analyses
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited analyses
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority processing
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      .PDF support
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced AI models
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Psychology & Psychiatry Analyze tech
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Real doctor feedback
                    </li>
                  </ul>
                  <p className="text-2xl font-bold mb-4">$9.99 / month</p>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full rounded-lg bg-white py-3 font-semibold text-[#6366F1] transition hover:bg-gray-100"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

