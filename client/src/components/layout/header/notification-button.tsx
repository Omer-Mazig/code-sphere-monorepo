import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const NotificationButton = () => {
  return (
    <Link to="/notifications">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
      </Button>
    </Link>
  );
};
