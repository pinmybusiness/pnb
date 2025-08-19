"use client"
import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Mail,
  Globe,
  Key,
  Download,
  Upload,
  Trash2
} from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    reports: true
  });

  const [profile, setProfile] = useState({
    name: "John Admin",
    email: "admin@company.com",
    role: "Company Administrator",
    timezone: "UTC-8 (Pacific)"
  });

  const cardClasses = "bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition hover:shadow-md";
  const btnClasses = "px-4 py-2 rounded-md font-medium transition text-white bg-primary hover:bg-primary/90";
  const btnOutline = "px-4 py-2 rounded-md font-medium transition border border-gray-300 hover:bg-gray-50";
  const badgeClasses = "px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-100";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
{/*      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and application preferences</p>
      </div>*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        {/*<div className="lg:col-span-1">
          <div className={cardClasses}>
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'data', label: 'Data & Export', icon: Database },
              ].map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-100 transition"
                >
                  <item.icon className="h-4 w-4 text-gray-500" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>*/}

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Profile Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
                  <input
                    id="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    value={profile.role}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  >
                    <option value="UTC-8 (Pacific)">UTC-8 (Pacific)</option>
                    <option value="UTC-5 (Eastern)">UTC-5 (Eastern)</option>
                    <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                    <option value="UTC+8 (Singapore)">UTC+8 (Singapore)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className={btnClasses}>Save Changes</button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>

            <div className="space-y-6">
              {[
                { key: 'email', title: 'Email Notifications', description: 'Receive updates and alerts via email', icon: Mail },
                // { key: 'push', title: 'Push Notifications', description: 'Browser push notifications for urgent alerts', icon: Globe },
                // { key: 'sms', title: 'SMS Notifications', description: 'Text messages for critical system alerts', icon: Bell },
                { key: 'reports', title: 'Weekly Reports', description: 'Automated performance reports every Monday', icon: Database }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium">{setting.title}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary focus:ring-primary rounded"
                    checked={notifications[setting.key]}
                    onChange={(e) => setNotifications({...notifications, [setting.key]: e.target.checked})}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Security & Privacy</h2>
            </div>

            <div className="space-y-4">
              
           {/*   <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hidden">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={badgeClasses}>Enabled</span>
                  <button className={btnOutline}>Configure</button>
                </div>
              </div>*/}

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
                <button className={btnOutline}>Change Password</button>
              </div>

              {/*Temp not requried*/}
              {/*<div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hidden">
                <div>
                  <h3 className="font-medium">Login Sessions</h3>
                  <p className="text-sm text-gray-500">Manage active sessions</p>
                </div>
                <button className={btnOutline}>View Sessions</button>
              </div>*/}

            </div>
          </div>

          {/* Data & Export */}
          <div className={cardClasses+ " hidden"}>
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Data Management</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className={`${btnOutline} h-auto p-4 flex flex-col items-center gap-2`}>
                  <Download className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Export Data</div>
                    <div className="text-xs text-gray-500">Download all your data</div>
                  </div>
                </button>

                <button className={`${btnOutline} h-auto p-4 flex flex-col items-center gap-2`}>
                  <Upload className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Import Data</div>
                    <div className="text-xs text-gray-500">Upload data from file</div>
                  </div>
                </button>
              </div>

              <hr className="border-gray-200" />

              {/* Delete account not requried */}
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 hidden">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium text-red-600">Danger Zone</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

