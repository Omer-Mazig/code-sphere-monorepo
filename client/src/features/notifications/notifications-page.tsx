import { useState } from "react";
import { Bell, Heart, MessageSquare, UserPlus, Check } from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { Notification } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";

const NotificationsPage = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.read;
    }
    return true;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleMarkAllAsRead = () => {
    // In a real app, we would call an API to mark all notifications as read
    console.log("Mark all as read");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <div className="flex items-center gap-4">
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "unread"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary-foreground text-primary w-5 h-5 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "unread"
              ? "No unread notifications"
              : "No notifications yet"}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationText = () => {
    const actorName = notification.actor?.username || "Someone";

    switch (notification.type) {
      case "like":
        return (
          <>
            <span className="font-medium">{actorName}</span> liked your post{" "}
            <a
              href={`/posts/${notification.postId}`}
              className="font-medium hover:underline"
            >
              {notification.post?.title}
            </a>
          </>
        );
      case "comment":
        return (
          <>
            <span className="font-medium">{actorName}</span> commented on your
            post{" "}
            <a
              href={`/posts/${notification.postId}`}
              className="font-medium hover:underline"
            >
              {notification.post?.title}
            </a>
          </>
        );
      case "follow":
        return (
          <>
            <span className="font-medium">{actorName}</span> started following
            you
          </>
        );
      default:
        return "New notification";
    }
  };

  const handleMarkAsRead = () => {
    // In a real app, we would call an API to mark the notification as read
    console.log("Mark as read:", notification.id);
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg ${
        notification.read ? "bg-card" : "bg-muted/50"
      }`}
    >
      <div className="flex-shrink-0 p-2 rounded-full bg-muted">
        {getNotificationIcon()}
      </div>

      <div className="flex-1">
        <p className="text-sm">{getNotificationText()}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt))}
        </p>
      </div>

      {!notification.read && (
        <button
          onClick={handleMarkAsRead}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Mark as read"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationsPage;
