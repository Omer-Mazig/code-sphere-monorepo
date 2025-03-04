import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUser } from "@/features/profile/hooks/useUsers";
import { useParams } from "react-router-dom";
export default function UserProfile() {
  const { id } = useParams();

  const { data: user, isLoading } = useGetUser(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={""}
          alt={user.firstName || user.username || "User"}
        />
        <AvatarFallback>
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {user.firstName || user.username}
        </h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
