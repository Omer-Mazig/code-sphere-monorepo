import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Following {
  id: string;
  username: string;
  profileImageUrl?: string;
}

interface ProfileFollowingProps {
  following: Following[];
  isOwnProfile: boolean;
}

const ProfileFollowing = ({
  following,
  isOwnProfile,
}: ProfileFollowingProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
      {following.length > 0 ? (
        following.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-4 border rounded-lg"
          >
            <Avatar>
              <AvatarImage
                src={user.profileImageUrl}
                alt={user.username}
              />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">@{user.username}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
            >
              {isOwnProfile ? "Unfollow" : "View Profile"}
            </Button>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground col-span-3">
          {isOwnProfile
            ? "You're not following anyone yet."
            : "This user isn't following anyone yet."}
        </p>
      )}
    </div>
  );
};

export default ProfileFollowing;
