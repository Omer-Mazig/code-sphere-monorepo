import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Upload,
  Trash2,
  Bell,
  Lock,
  Globe,
  Palette,
  Shield,
  Mail,
  Key,
  UserX,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NotificationKey =
  | "email"
  | "push"
  | "marketing"
  | "mentions"
  | "comments"
  | "follows";
type PrivacyKey =
  | "showEmail"
  | "showLocation"
  | "showWebsite"
  | "showCompany"
  | "showPosition";

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    bio: "Software developer passionate about building great products",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    company: "Tech Corp",
    position: "Senior Developer",
    profileImageUrl: "https://github.com/shadcn.png",
    skills: ["JavaScript", "React", "TypeScript", "Node.js"],
    notifications: {
      email: true,
      push: true,
      marketing: false,
      mentions: true,
      comments: true,
      follows: true,
    },
    privacy: {
      showEmail: false,
      showLocation: true,
      showWebsite: true,
      showCompany: true,
      showPosition: true,
    },
    theme: "light",
    language: "en",
    timezone: "America/Los_Angeles",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: NotificationKey) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePrivacyToggle = (key: PrivacyKey) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button
          variant="outline"
          asChild
        >
          <Link to="/me/profile">Back to Profile</Link>
        </Button>
      </div>

      <Tabs
        defaultValue="profile"
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={formData.profileImageUrl} />
                    <AvatarFallback>
                      {formData.firstName[0]}
                      {formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Add your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={() => handleNotificationToggle("email")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={() => handleNotificationToggle("push")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive marketing and promotional emails
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.marketing}
                  onCheckedChange={() => handleNotificationToggle("marketing")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone mentions you
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.mentions}
                  onCheckedChange={() => handleNotificationToggle("mentions")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about comments on your posts
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.comments}
                  onCheckedChange={() => handleNotificationToggle("comments")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Follows</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone follows you
                  </p>
                </div>
                <Switch
                  checked={formData.notifications.follows}
                  onCheckedChange={() => handleNotificationToggle("follows")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="privacy"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email address on your profile
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.showEmail}
                  onCheckedChange={() => handlePrivacyToggle("showEmail")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your location on your profile
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.showLocation}
                  onCheckedChange={() => handlePrivacyToggle("showLocation")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Website</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your website on your profile
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.showWebsite}
                  onCheckedChange={() => handlePrivacyToggle("showWebsite")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Company</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your company on your profile
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.showCompany}
                  onCheckedChange={() => handlePrivacyToggle("showCompany")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Position</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your position on your profile
                  </p>
                </div>
                <Switch
                  checked={formData.privacy.showPosition}
                  onCheckedChange={() => handlePrivacyToggle("showPosition")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="appearance"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, timezone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      Eastern Time
                    </SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="security"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Change Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Two-Factor Authentication
              </Button>
              <Separator />
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Danger Zone</AlertTitle>
                <AlertDescription>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                className="w-full justify-start"
              >
                <UserX className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
