import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

interface EmailNotifications {
  newFollower: boolean;
  comments: boolean;
  likes: boolean;
  mentions: boolean;
  directMessages: boolean;
}

const ProfileSettingsPage = () => {
  // Dummy user data
  const userData = {
    id: "123",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    profileImageUrl: "https://github.com/shadcn.png",
    bio: "Full-stack developer passionate about building great user experiences.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    isActive: true,
    emailNotifications: {
      newFollower: true,
      comments: true,
      likes: false,
      mentions: true,
      directMessages: true,
    },
    isPrivateAccount: false,
  };

  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
    bio: userData.bio || "",
    location: userData.location || "",
    website: userData.website || "",
    isPrivateAccount: userData.isPrivateAccount,
    emailNotifications: { ...userData.emailNotifications },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === "isPrivateAccount") {
      setFormData((prev) => ({
        ...prev,
        isPrivateAccount: checked,
      }));
    } else {
      // Handle email notification switches
      setFormData((prev) => ({
        ...prev,
        emailNotifications: {
          ...prev.emailNotifications,
          [name]: checked,
        },
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission to update the user profile
    console.log("Form submitted:", { ...formData, profileImage });
    // API call would go here
  };

  return (
    <div className="container mx-auto py-6 space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information and preferences
          </p>
        </div>
        <Link
          to="/me/profile"
          className="text-primary hover:underline"
        >
          Back to Profile
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Profile Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a new profile picture. Recommended size is 400x400 pixels.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={previewUrl || userData.profileImageUrl}
                alt={userData.username}
              />
              <AvatarFallback>
                {userData.firstName[0]}
                {userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-4">
              <Input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-md"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2"
              >
                Remove Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="Tell us about yourself"
                className="resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Manage your account privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="privateAccount">Private Account</Label>
                <p className="text-sm text-muted-foreground">
                  Only approved followers can see your content
                </p>
              </div>
              <Switch
                id="privateAccount"
                checked={formData.isPrivateAccount}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("isPrivateAccount", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Choose which email notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyNewFollower">New Followers</Label>
              <Switch
                id="notifyNewFollower"
                checked={formData.emailNotifications.newFollower}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("newFollower", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifyComments">Comments on Your Posts</Label>
              <Switch
                id="notifyComments"
                checked={formData.emailNotifications.comments}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("comments", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifyLikes">Likes on Your Posts</Label>
              <Switch
                id="notifyLikes"
                checked={formData.emailNotifications.likes}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("likes", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifyMentions">Mentions</Label>
              <Switch
                id="notifyMentions"
                checked={formData.emailNotifications.mentions}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("mentions", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifyDirectMessages">Direct Messages</Label>
              <Switch
                id="notifyDirectMessages"
                checked={formData.emailNotifications.directMessages}
                onCheckedChange={(checked: boolean) =>
                  handleSwitchChange("directMessages", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Deactivate Account
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
