import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";

export const UserMenu = () => {
  const api = useAuthenticatedApi();

  const removeAccount = async () => {
    try {
      const response = await api.delete("/users/profile");
      console.log("User successfully deleted:", response);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="flex items-center">
      <UserButton
        afterSignOutUrl="/"
        userProfileUrl="/me/profile"
      />
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="ml-1"
      >
        <Link to="/me/profile">
          <User className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </Button>
    </div>
  );
};
