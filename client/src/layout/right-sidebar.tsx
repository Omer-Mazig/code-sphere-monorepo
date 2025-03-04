import { users, posts } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RightSidebar = () => {
  // Get top 3 posts by views
  const trendingPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // Get 5 random users for suggestions
  const suggestedUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <div className="sticky top-16 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trending Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingPosts.map((post) => (
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
                <span>{post.author?.username}</span>
                <span>•</span>
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Who to Follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={user.username}
                  />
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/users/${user.username}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {user.username}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {user.bio}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
              >
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { title: "Documentation", href: "/docs" },
            { title: "API Reference", href: "/api" },
            { title: "Community Guidelines", href: "/guidelines" },
            { title: "Privacy Policy", href: "/privacy" },
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center text-sm hover:underline"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              {link.title}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
