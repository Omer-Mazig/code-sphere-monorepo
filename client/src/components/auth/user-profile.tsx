import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/features/profile/hooks/useUsers";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();

  const { data: profile, isLoading, isError } = useGetUserProfile(id as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or you may not have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={profile.avatarUrl || ""}
          alt={profile.displayName || profile.username || "User"}
        />
        <AvatarFallback>
          {profile.firstName?.charAt(0)}
          {profile.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {profile.displayName || profile.firstName || profile.username}
        </h2>
        {profile.username && (
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        )}
        {profile.bio && <p className="mt-2 max-w-md">{profile.bio}</p>}
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-sm">
            <span className="font-semibold">{profile.followersCount}</span>{" "}
            Followers
          </div>
          <div className="text-sm">
            <span className="font-semibold">{profile.followingCount}</span>{" "}
            Following
          </div>
        </div>
      </div>
    </div>
  );
}
