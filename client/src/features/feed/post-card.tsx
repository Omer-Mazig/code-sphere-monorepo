import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { Post } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author?.avatarUrl}
              alt={post.author?.username}
            />
            <AvatarFallback>
              {post.author?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/users/${post.author?.username}`}
              className="text-sm font-medium hover:underline"
            >
              {post.author?.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.publishedAt))}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-2">
          <Link
            to={`/posts/${post.id}`}
            className="hover:underline"
          >
            <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
          </Link>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                asChild
              >
                <Link to={`/tags/${tag.toLowerCase()}`}>{tag}</Link>
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground line-clamp-3">
            {post.content
              .replace(/^#.*$/m, "")
              .replace(/```[\s\S]*?```/g, "")
              .trim()
              .slice(0, 200)}
            {post.content.length > 200 ? "..." : ""}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 py-3 text-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-auto p-1"
          >
            <Heart className="h-4 w-4" />
            <span>{post.likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-auto p-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
