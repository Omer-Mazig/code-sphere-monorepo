import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl?: string;
  posts: any[];
  followers: any[];
  following: any[];
  createdAt: Date;
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
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-shrink-0">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={userData.profileImageUrl}
            alt={userData.username}
          />
          <AvatarFallback>
            {userData.firstName[0]}
            {userData.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow space-y-4">
        <div>
          <h1 className="text-2xl font-bold">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-muted-foreground">@{userData.username}</p>
          <p className="text-sm text-muted-foreground">
            Member since {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="font-bold">{userData.posts.length}</span> posts
          </div>
          <div>
            <span className="font-bold">{userData.followers.length}</span>{" "}
            followers
          </div>
          <div>
            <span className="font-bold">{userData.following.length}</span>{" "}
            following
          </div>
        </div>

        <div className="flex gap-2">
          {isOwnProfile ? (
            <>
              <Button asChild>
                <Link to="/me/settings">Edit Profile</Link>
              </Button>
              <Button variant="outline">Share Profile</Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={onFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button variant="outline">Message</Button>
              <Button variant="outline">Share Profile</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
