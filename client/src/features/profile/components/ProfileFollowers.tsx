import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Follower {
  id: string;
  username: string;
  profileImageUrl?: string;
}

interface ProfileFollowersProps {
  followers: Follower[];
  isOwnProfile: boolean;
}

const ProfileFollowers = ({
  followers,
  isOwnProfile,
}: ProfileFollowersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
      {followers.length > 0 ? (
        followers.map((follower) => (
          <div
            key={follower.id}
            className="flex items-center gap-3 p-4 border rounded-lg"
          >
            <Avatar>
              <AvatarImage
                src={follower.profileImageUrl}
                alt={follower.username}
              />
              <AvatarFallback>{follower.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">@{follower.username}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
            >
              {isOwnProfile ? "Remove" : "View Profile"}
            </Button>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground col-span-3">
          {isOwnProfile
            ? "You don't have any followers yet."
            : "This user doesn't have any followers yet."}
        </p>
      )}
    </div>
  );
};

export default ProfileFollowers;
