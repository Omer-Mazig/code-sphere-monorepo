import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { UserButton } from "@clerk/clerk-react";

export const UserMenu = () => {
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
