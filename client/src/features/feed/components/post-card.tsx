import { Bookmark, Share2, UsersIcon, MessageCircleIcon } from "lucide-react";
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
import { Post } from "../schemas/post.schema";
import { LikeButton } from "./like-button";
import { CommentButton } from "./comment-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  // Generate display name from first name and last name or use email as fallback
  const displayName = post.author
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
      post.author.email.split("@")[0]
    : "Anonymous";

  // Generate avatar fallback from display name
  const avatarFallback = displayName.slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-12">
            <AvatarImage
              src={undefined}
              alt={displayName}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/profile/${post.author?.id}`}
              className="font-medium hover:underline"
            >
              {displayName}
            </Link>
            <p className="text-xs text-muted-foreground">Title</p>

            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.publishedAt))}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Link
            to={`/posts/${post.id}`}
            className="hover:underline"
          >
            <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
          </Link>

          <div className="flex flex-wrap gap-2 my-3">
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

      <CardFooter className="flex items-center justify-between border-t px-4 pt-4 text-sm">
        <div className="flex items-center gap-4">
          <LikeButton
            postId={post.id}
            isLiked={post.isLikedByCurrentUser}
          />

          <CommentButton postId={post.id} />

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

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-auto p-1"
              >
                <UsersIcon className="h-4 w-4" />
                <span>{post.likesCount} likes</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>People who liked this post</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {/* Empty state - fetching functionality to be implemented later */}
                <p className="text-center text-muted-foreground">
                  {post.likesCount > 0 ? "Loading likes..." : "No likes yet"}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-auto p-1"
              >
                <MessageCircleIcon className="h-4 w-4" />
                <span>{post.commentsCount} comments</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>People who commented on this post</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {/* Empty state - fetching functionality to be implemented later */}
                <p className="text-center text-muted-foreground">
                  {post.commentsCount > 0
                    ? "Loading comments..."
                    : "No comments yet"}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};
