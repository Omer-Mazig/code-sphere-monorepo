import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Share2,
  MessageSquare,
  MapPin,
  Building2,
  Briefcase,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  position?: string;
  posts: any[];
  followers: any[];
  following: any[];
  createdAt: Date;
  skills?: string[];
};

interface ProfileHeaderProps {
  userData: UserData;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const ProfileHeader = ({
  userData,
  isOwnProfile,
  isFollowing,
  onFollowToggle,
}: ProfileHeaderProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div className="relative group">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userData.profileImageUrl}
                alt={userData.username}
              />
              <AvatarFallback>
                {userData.firstName[0]}
                {userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-muted-foreground">@{userData.username}</p>
              <p className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 inline mr-1" />
                Member since{" "}
                {new Date(userData.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="/me/settings">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={onFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
              {!isOwnProfile && (
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
          </div>

          {userData.bio && (
            <p className="text-muted-foreground">{userData.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {userData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.company && (
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{userData.company}</span>
              </div>
            )}
            {userData.position && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{userData.position}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={userData.website}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{userData.posts.length}</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{userData.followers.length}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{userData.following.length}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>

          {userData.skills && userData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {userData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
