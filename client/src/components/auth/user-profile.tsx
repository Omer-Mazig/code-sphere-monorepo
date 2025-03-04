import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={user.imageUrl}
          alt={user.fullName || user.username || "User"}
        />
        <AvatarFallback>
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {user.fullName || user.username}
        </h2>
        <p className="text-sm text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </div>
  );
}
