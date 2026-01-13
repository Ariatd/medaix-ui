import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useKeyboardShortcutsContext } from '../components/KeyboardShortcutsProvider';
import ShortcutHint from '../components/ShortcutHint';

interface UserSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'tr' | 'es';
  confidenceThreshold: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoDeleteDays: number | null;
  twoFactorEnabled: boolean;
  exportFormat: 'pdf' | 'json' | 'csv';
  debugMode: boolean;
}

const Settings: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'privacy' | 'advanced'>('account');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('medaix_settings');
    return saved
      ? JSON.parse(saved)
      : {
          theme,
          language: 'en',
          confidenceThreshold: 75,
          emailNotifications: true,
          pushNotifications: false,
          autoDeleteDays: null,
          twoFactorEnabled: false,
          exportFormat: 'pdf',
          debugMode: false,
        };
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const saveSettings = () => {
    localStorage.setItem('medaix_settings', JSON.stringify(settings));
    addToast('Settings saved successfully', 'success');
  };

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      addToast('Name and email are required', 'error');
      return;
    }
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    addToast('Profile updated successfully', 'success');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('medaix_avatar', reader.result as string);
        addToast('Avatar updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('medaix_user');
    localStorage.removeItem('medaix_users');
    addToast('Account deleted', 'success');
    logout();
  };

  const handleThemeChange = () => {
    toggleTheme();
    setSettings((prev) => ({
      ...prev,
      theme: theme === 'light' ? 'dark' : 'light',
    }));
    addToast(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'info');
  };

  const handleClearCache = () => {
    localStorage.clear();
    addToast('Cache cleared. Please refresh the page.', 'success');
  };

  const handleResetSettings = () => {
    setSettings({
      theme,
      language: 'en',
      confidenceThreshold: 75,
      emailNotifications: true,
      pushNotifications: false,
      autoDeleteDays: null,
      twoFactorEnabled: false,
      exportFormat: 'pdf',
      debugMode: false,
    });
    addToast('Settings reset to defaults', 'success');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background-50 dark:bg-gray-900 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs - Responsive */}
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {(['account', 'preferences', 'privacy', 'advanced'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 sm:py-3 font-medium whitespace-nowrap border-b-2 text-sm sm:text-base transition ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* TAB 1 - Account Settings */}
          {activeTab === 'account' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Avatar Section - Responsive */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl sm:text-3xl text-primary-600 dark:text-primary-400">👤</span>
                  )}
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
                  >
                    Upload Avatar
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Profile Fields - Responsive */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition text-sm sm:text-base"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 - Preferences */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
              </div>

              {/* Theme Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Dark Mode</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Switch between light and dark theme</p>
                </div>
                <button
                  onClick={handleThemeChange}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                    theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, language: e.target.value as 'en' | 'tr' | 'es' }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  <option value="en">English</option>
                  <option value="tr">Turkish</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keyboard Shortcuts</label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">View and configure keyboard shortcuts. Press <strong>?</strong> to open the shortcuts help modal.</p>
                    <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <div className="flex items-center gap-2"> <span className="font-medium">Search</span><ShortcutHint keys="mod+k" /></div>
                      <div className="flex items-center gap-2"> <span className="font-medium">New Analysis</span><ShortcutHint keys="mod+n" /></div>
                      <div className="flex items-center gap-2"> <span className="font-medium">Help</span><ShortcutHint keys="mod+/" /></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                    <button
                      onClick={() => {
                        try { useKeyboardShortcutsContext().openHelp(); } catch (e) { /* ignore if not in provider */ }
                      }}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm sm:text-base"
                    >
                      Open Shortcuts
                    </button>
                    <button 
                      onClick={() => {
                        const disabled = localStorage.getItem('max_shortcuts_disabled') === '1';
                        localStorage.setItem('max_shortcuts_disabled', disabled ? '0' : '1');
                        addToast(`Keyboard shortcuts ${disabled ? 'enabled' : 'disabled'}`, 'info');
                      }} 
                      className="px-3 py-2 border rounded text-sm sm:text-base"
                    >
                      Enable / Disable
                    </button>
                  </div>
                </div>
              </div>

              {/* Confidence Threshold */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Default Confidence Threshold: {settings.confidenceThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={settings.confidenceThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, confidenceThreshold: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Email Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Email Notifications</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive email updates on important events</p>
                </div>
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                    settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Push Notifications</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive browser push notifications</p>
                </div>
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, pushNotifications: !prev.pushNotifications }))
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                    settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-delete */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-delete Old Analyses After
                </label>
                <select
                  value={settings.autoDeleteDays || 'never'}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoDeleteDays: e.target.value === 'never' ? null : Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <button
                onClick={saveSettings}
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 3 - Privacy & Security */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h2>
              </div>

              {/* 2FA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Two-Factor Authentication</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Add extra security to your account</p>
                </div>
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
                  }
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                    settings.twoFactorEnabled ? 'bg-success-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Login History */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-sm sm:text-base">Recent Login History</h3>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro', location: 'San Francisco, CA', time: '2 hours ago' },
                    { device: 'iPhone 14', location: 'San Francisco, CA', time: '1 day ago' },
                    { device: 'Chrome Browser', location: 'San Francisco, CA', time: '3 days ago' },
                    { device: 'Safari Browser', location: 'Portland, OR', time: '1 week ago' },
                    { device: 'Firefox Browser', location: 'San Francisco, CA', time: '2 weeks ago' },
                  ].map((login, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white font-medium truncate">{login.device}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{login.location}</p>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-right">{login.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-sm sm:text-base">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white font-medium text-sm">This Device</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Current session</p>
                    </div>
                    <span className="text-success-600 dark:text-success-400 text-sm font-medium self-start sm:self-center">Active</span>
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm sm:text-base">
                📥 Download My Data (JSON)
              </button>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Terms of Service
                </a>
              </div>

              <button
                onClick={saveSettings}
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                Save Security Settings
              </button>
            </div>
          )}

          {/* TAB 4 - Advanced */}
          {activeTab === 'advanced' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Advanced Settings</h2>
              </div>

              {/* Export Format */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Export Format
                </label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, exportFormat: e.target.value as 'pdf' | 'json' | 'csv' }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              {/* API Key */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key (for Developers)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value="sk_live_xxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                  />
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base w-full sm:w-auto">
                    Copy
                  </button>
                </div>
                <button className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  Generate New Key
                </button>
              </div>

              {/* Webhook URL */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook URL (for Integrations)
                </label>
                <input
                  type="text"
                  placeholder="https://your-domain.com/webhook"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                />
              </div>

              {/* Debug Mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Debug Mode</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Show detailed error messages and logs</p>
                </div>
                <button
                  onClick={() => setSettings((prev) => ({ ...prev, debugMode: !prev.debugMode }))}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition flex-shrink-0 ${
                    settings.debugMode ? 'bg-warning-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.debugMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-4 border-2 border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-900/10 rounded-lg">
                <h3 className="font-semibold text-danger-900 dark:text-danger-200 mb-3 text-sm sm:text-base">Danger Zone</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleClearCache}
                    className="w-full px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition text-sm sm:text-base"
                  >
                    Clear Cache
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className="w-full px-4 py-2 border border-danger-600 text-danger-600 dark:text-danger-400 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 transition text-sm sm:text-base"
                  >
                    Reset All Settings
                  </button>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                Save Advanced Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal - Responsive */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-4 sm:p-6 space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  if (formData.newPassword !== formData.confirmPassword) {
                    addToast('Passwords do not match', 'error');
                    return;
                  }
                  addToast('Password changed successfully', 'success');
                  setShowPasswordModal(false);
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  }));
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal - Responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-4 sm:p-6 space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-danger-600 dark:text-danger-400">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition text-sm sm:text-base"
              >
                Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
