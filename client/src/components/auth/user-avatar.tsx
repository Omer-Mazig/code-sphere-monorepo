import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";

interface UserAvatarProps {
  className?: string;
}

export default function UserAvatar({ className = "" }: UserAvatarProps) {
  const { user } = useUser();

  if (!user) {
    return (
      <Avatar className={className}>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.imageUrl}
        alt={user.fullName || user.username || "User"}
      />
      <AvatarFallback>
        {user.firstName?.charAt(0)}
        {user.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
