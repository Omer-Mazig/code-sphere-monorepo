import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock notification data (in a real app this would come from an API or state)
interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Sample notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Someone commented on your post",
    timestamp: "5m ago",
    read: false,
  },
  {
    id: "2",
    message: "You received a new message",
    timestamp: "10m ago",
    read: false,
  },
  {
    id: "3",
    message: "Your project was featured",
    timestamp: "1h ago",
    read: false,
  },
  {
    id: "4",
    message: "New team member joined",
    timestamp: "2h ago",
    read: true,
  },
  {
    id: "5",
    message: "Weekly summary is ready",
    timestamp: "5h ago",
    read: true,
  },
];

export const NotificationButton = () => {
  // Count unread notifications
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="end"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </div>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {mockNotifications.length > 0 ? (
            mockNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0"
              >
                <div
                  className={`w-full px-4 py-2 ${!notification.read ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <span className="text-xs text-slate-500">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-slate-500">No notifications yet</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center p-0">
          <Link
            to="/notifications"
            className="w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
