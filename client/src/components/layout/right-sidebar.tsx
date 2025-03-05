import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPosts } from "@/features/feed/hooks/usePosts";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUserProfile } from "@/features/profile/api/users.api";

// Interface for suggested users if API returns a different structure
interface SuggestedUser {
  id: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
}

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);

  // Fetch trending posts with views sorting
  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPosts("views");

  // Fetch suggested users
  const { data: currentUserProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: () => getCurrentUserProfile(),
  });

  // Fetch random users for suggestions
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        // This is a temporary solution since we don't have a dedicated API
        // endpoint for suggested users. In a real application, this would be
        // handled by the backend.
        const response = await fetch("http://localhost:3000/api/users");
        const users: SuggestedUser[] = await response.json();

        // Filter out current user and get 5 random users
        const filteredUsers = users
          .filter((user) => user.id !== currentUserProfile?.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        setSuggestedUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    if (currentUserProfile) {
      fetchSuggestedUsers();
    }
  }, [currentUserProfile]);

  // Get top 3 trending posts
  const trendingPosts = posts?.slice(0, 3) || [];

  return (
    <div className="sticky top-16 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trending Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPostsLoading ? (
            // Loading skeleton
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="space-y-2"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
          ) : postsError ? (
            <div className="text-sm text-muted-foreground">
              Error loading trending posts
            </div>
          ) : trendingPosts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No trending posts available
            </div>
          ) : (
            trendingPosts.map((post) => (
              <div
                key={post.id}
                className="space-y-1"
              >
                <Link
                  to={`/posts/${post.id}`}
                  className="text-sm font-medium hover:underline line-clamp-2"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {typeof post.author === "object" && post.author
                      ? post.author.firstName || post.author.lastName
                        ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim()
                        : "Anonymous"
                      : "Unknown"}
                  </span>
                  <span>•</span>
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Who to Follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentUserProfile ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
          ) : suggestedUsers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No suggestions available
            </div>
          ) : (
            suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.username || ""}
                  />
                  <AvatarFallback>
                    {user.username
                      ? user.username.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">
                    {user.username || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.bio?.substring(0, 30) || "No bio available"}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                >
                  Follow
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Useful Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/help"
              className="text-muted-foreground hover:underline"
            >
              Help Center
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:underline"
            >
              About
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              to="/careers"
              className="text-muted-foreground hover:underline"
            >
              Careers
            </Link>
            <a
              href="https://github.com/yourusername/codeshpere"
              rel="noopener noreferrer"
              target="_blank"
              className="text-muted-foreground hover:underline inline-flex items-center gap-1"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2023 CodeSphere. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
