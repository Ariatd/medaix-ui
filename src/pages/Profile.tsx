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
      <div className="bg-background px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#333333]">User Profile</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your account settings and profile information</p>
          </div>

          {/* Success Alert - Responsive */}
          {success && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-success bg-success-50 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-success mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-success">{success}</p>
            </div>
          )}

          {/* Error Alert - Responsive */}
          {error && (
            <div className="mb-4 sm:mb-6 flex items-start gap-3 rounded-lg border border-danger bg-danger-50 p-3 sm:p-4">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-danger mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Main Content Grid - Responsive */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Left Column - Avatar and Basic Info */}
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-md">
                {/* Avatar - Responsive */}
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
                      className="rounded-lg bg-primary px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      Upload Avatar
                    </button>
                  </label>
                </div>

                {/* Member Info - Responsive */}
                <div className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-4 sm:pt-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Member Since</p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-gray-800">{memberSinceDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Account Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-800">Active</span>
                    </div>
                  </div>
                </div>

                {/* Logout Button - Responsive */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to log out?')) {
                      logout();
                    }
                  }}
                  className="mt-4 sm:mt-6 w-full rounded-lg border-2 border-danger px-3 sm:px-4 py-2 font-semibold text-danger transition hover:bg-danger-50 text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Right Column - Form and Stats */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Profile Form - Responsive */}
              <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-md">
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#333333]">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-lg bg-primary px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  // Edit Form - Responsive
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-success px-3 sm:px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display View - Responsive
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Full Name</p>
                      <p className="mt-1 text-sm sm:text-lg font-medium text-gray-800">{currentUser?.name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                      <p className="mt-1 text-sm sm:text-lg font-medium text-gray-800">{currentUser?.email}</p>
                    </div>

                    {formData.bio && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Bio</p>
                        <p className="mt-1 text-xs sm:text-sm text-gray-700">{formData.bio}</p>
                      </div>
                    )}

                    {formData.phone && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                        <p className="mt-1 text-sm sm:text-lg font-medium text-gray-800">{formData.phone}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="rounded-lg bg-gray-100 px-3 sm:px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-200 text-xs sm:text-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Info Cards - Responsive */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Account Type</p>
                  <p className="mt-1 text-lg sm:text-xl font-bold text-primary">Researcher</p>
                </div>

                <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Institution</p>
                  <p className="mt-1 text-lg sm:text-xl font-bold text-gray-800">TED University</p>
                </div>

                <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Member Since</p>
                  <p className="mt-1 text-sm sm:text-lg font-bold text-gray-800">{memberSinceDate}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="rounded-lg bg-white p-4 sm:p-6 shadow-md">
                <p className="text-xs font-semibold text-gray-600 uppercase">Department</p>
                <p className="mt-1 text-sm sm:text-base font-medium text-gray-800">Software Engineering</p>
                <p className="mt-3 sm:mt-4 text-xs font-semibold text-gray-600 uppercase">Research Focus</p>
                <p className="mt-1 text-sm sm:text-base font-medium text-gray-800">Medical Image Analysis</p>
              </div>

              {/* Recent Analyses - Responsive */}
              <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-md">
                <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#333333]">Recent Analyses</h2>

                <div className="space-y-3">
                  {recentAnalyses.map(analysis => (
                    <div key={analysis.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 sm:p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm">{analysis.type}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{analysis.date}</p>
                      </div>
                      <div className="rounded-lg bg-primary-50 px-2 sm:px-3 py-1 flex-shrink-0">
                        <span className="font-semibold text-primary text-xs sm:text-sm">{analysis.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal - Responsive */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl">
            <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-[#333333]">Change Password</h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="mb-1 sm:mb-2 block text-xs sm:text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 text-xs sm:text-sm"
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
                  className="flex-1 rounded-lg border-2 border-gray-300 px-3 sm:px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
