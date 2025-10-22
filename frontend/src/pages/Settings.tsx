import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/authStore";
import { apiFetch } from "@/lib/api";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Download,
  Upload,
  Save,
  AlertCircle,
} from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { auth } = useAuthHeaders();
  const [theme, setTheme] = useState('light');

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: '',
    bio: '',
    location: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
    performanceAlerts: true,
    attendanceAlerts: false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'KSH',
    numberFormat: '10,000.00',
    weekStartsOn: 'monday',
  });

  // Data settings
  const [dataSettings, setDataSettings] = useState({
    dataRetention: '365',
    autoBackup: true,
    exportFormat: 'csv',
  });

  useEffect(() => {
    // Initialize from backend user
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username || user.email,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    const payload = {
      first_name: profileData.name.split(' ')[0] || '',
      last_name: profileData.name.split(' ').slice(1).join(' ') || '',
      phone: profileData.phone,
      department: profileData.department,
      bio: profileData.bio,
      location: profileData.location,
    };
    const resp = await apiFetch('/users/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      auth,
    });
    if (!resp.ok) return;
  };

  const handleNotificationUpdate = async () => {
    const payload = {
      email_alerts: notifications.emailAlerts,
      push_notifications: notifications.pushNotifications,
      weekly_reports: notifications.weeklyReports,
      performance_alerts: notifications.performanceAlerts,
      attendance_alerts: notifications.attendanceAlerts,
    };
    const resp = await apiFetch('/users/settings/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      auth,
    });
    if (!resp.ok) return;
  };

  const handleSecurityUpdate = async () => {
    const payload = {
      two_factor_auth: security.twoFactorAuth,
      session_timeout: security.sessionTimeout,
      password_expiry: security.passwordExpiry,
    };
    const resp = await apiFetch('/users/settings/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      auth,
    });
    if (!resp.ok) return;
  };

  const handlePreferencesUpdate = async () => {
    const payload = {
      language: preferences.language,
      timezone: preferences.timezone,
      date_format: preferences.dateFormat,
      currency: preferences.currency,
      number_format: preferences.numberFormat,
      week_starts_on: preferences.weekStartsOn,
      theme,
    };
    const resp = await apiFetch('/users/settings/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      auth,
    });
    if (!resp.ok) return;
  };

  const handleDataSettingsUpdate = async () => {
    const payload = {
      data_retention: dataSettings.dataRetention,
      auto_backup: dataSettings.autoBackup,
      export_format: dataSettings.exportFormat,
    };
    const resp = await apiFetch('/users/settings/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      auth,
    });
    if (!resp.ok) return;
  };

  const handleExportData = async () => {
    try {
      // Export user data
      const exportData = {
        profile: profileData,
        notifications,
        security,
        preferences: { ...preferences, theme },
        dataSettings,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hr-intelligence-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate and import data
        if (data.profile) setProfileData(data.profile);
        if (data.notifications) setNotifications(data.notifications);
        if (data.security) setSecurity(data.security);
        if (data.preferences) {
          setPreferences(data.preferences);
          if (data.preferences.theme) setTheme(data.preferences.theme);
        }
        if (data.dataSettings) setDataSettings(data.dataSettings);

        alert('Data imported successfully! Please save your changes.');
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    input.click();
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete your account and all associated data. Are you absolutely sure?')) {
      return;
    }

    try {
      const resp = await apiFetch('/users/delete-account/', {
        method: 'DELETE',
        auth,
      });

      if (resp.ok) {
        alert('Account deleted successfully. You will be redirected to the login page.');
        logout();
        window.location.href = '/signin';
      } else {
        alert('Error deleting account. Please contact support.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Error deleting account. Please try again.');
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your HR data. Are you absolutely sure?')) {
      return;
    }

    try {
      const resp = await apiFetch('/users/clear-data/', {
        method: 'DELETE',
        auth,
      });

      if (resp.ok) {
        alert('All data cleared successfully.');
        // Refresh the page to show empty state
        window.location.reload();
      } else {
        alert('Error clearing data. Please contact support.');
      }
    } catch (error) {
      console.error('Clear data error:', error);
      alert('Error clearing data. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={handleProfileUpdate} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly HR analytics summaries
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerts for performance milestones and issues
                  </p>
                </div>
                <Switch
                  checked={notifications.performanceAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, performanceAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for attendance patterns
                  </p>
                </div>
                <Switch
                  checked={notifications.attendanceAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, attendanceAlerts: checked })
                  }
                />
              </div>
            </div>
            <Button onClick={handleNotificationUpdate} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Update Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactorAuth: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Select
                  value={security.sessionTimeout}
                  onValueChange={(value) =>
                    setSecurity({ ...security, sessionTimeout: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Select
                  value={security.passwordExpiry}
                  onValueChange={(value) =>
                    setSecurity({ ...security, passwordExpiry: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSecurityUpdate} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Update Security
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, dateFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KSH">KSH (KSh)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number-format">Number Format</Label>
                <Select
                  value={preferences.numberFormat}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, numberFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1,000.00">1,000.00</SelectItem>
                    <SelectItem value="1 000,00">1 000,00</SelectItem>
                    <SelectItem value="1000.00">1000.00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="week-starts">Week Starts On</Label>
                <Select
                  value={preferences.weekStartsOn}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, weekStartsOn: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handlePreferencesUpdate} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Update Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your data retention, backups, and export/import options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention (days)</Label>
                <Select
                  value={dataSettings.dataRetention}
                  onValueChange={(value) =>
                    setDataSettings({ ...dataSettings, dataRetention: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup your data
                  </p>
                </div>
                <Switch
                  checked={dataSettings.autoBackup}
                  onCheckedChange={(checked) =>
                    setDataSettings({ ...dataSettings, autoBackup: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select
                  value={dataSettings.exportFormat}
                  onValueChange={(value) =>
                    setDataSettings({ ...dataSettings, exportFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleExportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={handleImportData} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
              <Button onClick={handleDataSettingsUpdate}>
                <Save className="mr-2 h-4 w-4" />
                Update Data Settings
              </Button>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-destructive">Danger Zone</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleClearAllData}>
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
