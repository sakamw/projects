import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Select } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../components/ui/toast";
import { useTheme } from "../../hooks/useTheme";
import { api } from "../../lib/api";

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
  preferences: {
    theme: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    profileVisibility: string;
    showEmail: boolean;
    showPhone: boolean;
    allowMessages: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile and settings
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      return await api.fetchUserProfile();
    },
  });

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      phone: "",
      address: "",
      bio: "",
    },
    preferences: {
      theme: "light",
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
    },
  });

  // Update settings when userProfile data is loaded
  useEffect(() => {
    if (userProfile) {
      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          email: userProfile.email || "",
          username: userProfile.username || "",
          phone: userProfile.phone || "",
          address: userProfile.address || "",
          bio: userProfile.bio || "",
        },
        preferences: {
          ...prev.preferences,
          theme: userProfile.preferences?.theme || contextTheme,
          emailNotifications:
            userProfile.preferences?.emailNotifications ?? true,
          pushNotifications: userProfile.preferences?.pushNotifications ?? true,
          weeklyDigest: userProfile.preferences?.weeklyDigest ?? false,
        },
        privacy: {
          ...prev.privacy,
          profileVisibility: userProfile.privacy?.profileVisibility || "public",
          showEmail: userProfile.privacy?.showEmail ?? false,
          showPhone: userProfile.privacy?.showPhone ?? false,
          allowMessages: userProfile.privacy?.allowMessages ?? true,
        },
      }));
    }
  }, [userProfile]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: UserSettings) => {
      // Update profile information via API
      await api.updateUserProfile({
        firstName: updatedSettings.profile.firstName,
        lastName: updatedSettings.profile.lastName,
        username: updatedSettings.profile.username,
        phone: updatedSettings.profile.phone,
        address: updatedSettings.profile.address,
        bio: updatedSettings.profile.bio,
      });
      return updatedSettings;
    },
    onSuccess: () => {
      showToast("Profile updated successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update profile";
      showToast(errorMessage, { variant: "destructive" });
    },
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      theme: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      weeklyDigest: boolean;
    }) => {
      await api.updateUserPreferences(preferences);
      return preferences;
    },
    onSuccess: (preferences) => {
      // Update theme context
      setContextTheme(preferences.theme as "light" | "dark" | "system");
      showToast("Preferences updated successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update preferences";
      showToast(errorMessage, { variant: "destructive" });
    },
  });

  // Update privacy mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: async (privacy: {
      profileVisibility: string;
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
    }) => {
      await api.updateUserPrivacy(privacy);
      return privacy;
    },
    onSuccess: () => {
      showToast("Privacy settings updated successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to update privacy settings";
      showToast(errorMessage, { variant: "destructive" });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      // In a real app, this would call the backend API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      showToast("Password changed successfully", { variant: "success" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      showToast("Failed to change password", { variant: "destructive" });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(settings.preferences);
  };

  const handleSavePrivacy = () => {
    updatePrivacyMutation.mutate(settings.privacy);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", { variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", {
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={settings.profile.firstName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: {
                            ...settings.profile,
                            firstName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={settings.profile.lastName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          profile: {
                            ...settings.profile,
                            lastName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={settings.profile.email}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email address cannot be changed for security reasons
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={settings.profile.username}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: {
                          ...settings.profile,
                          username: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={settings.profile.address}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: {
                          ...settings.profile,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={settings.profile.bio}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, bio: e.target.value },
                      })
                    }
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your app experience and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <Select
                    value={settings.preferences.theme}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          theme: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Email Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.preferences.emailNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              emailNotifications: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Push Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.preferences.pushNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              pushNotifications: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of activity
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.preferences.weeklyDigest}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              weeklyDigest: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={updatePreferencesMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updatePreferencesMutation.isPending
                      ? "Saving..."
                      : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control what information is visible to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    Profile Visibility
                  </label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          profileVisibility: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Email</p>
                        <p className="text-sm text-muted-foreground">
                          Allow other users to see your email address
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              showEmail: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Phone</p>
                        <p className="text-sm text-muted-foreground">
                          Allow other users to see your phone number
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.showPhone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              showPhone: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Allow Messages</p>
                        <p className="text-sm text-muted-foreground">
                          Allow other users to send you messages
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowMessages}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            privacy: {
                              ...settings.privacy,
                              allowMessages: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSavePrivacy}
                    disabled={updatePrivacyMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updatePrivacyMutation.isPending
                      ? "Saving..."
                      : "Save Privacy Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {settings.security.twoFactorEnabled && (
                          <Badge variant="secondary">Enabled</Badge>
                        )}
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorEnabled}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              security: {
                                ...settings.security,
                                twoFactorEnabled: e.target.checked,
                              },
                            })
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Login Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.loginAlerts}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              loginAlerts: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "Changing..."
                      : "Change Password"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
