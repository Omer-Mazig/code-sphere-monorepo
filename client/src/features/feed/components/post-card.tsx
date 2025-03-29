import { Bookmark, Heart, Share2 } from "lucide-react";
import { formatDistanceToNow } from "shared/utils/dates.utils";
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
import { CommentButton } from "./comment-button";
import { LikesDialog } from "./likes-dialog";
import { CommentsDialog } from "./comments-dialog";
import { PostOptionsMenu } from "./post-options-menu";
import { cn, getUserNameDisplayNameAndAvatar } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../hooks/posts/posts.hooks";
import { likePost, unlikePost } from "../api/likes.api";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { displayName, avatarFallback } = getUserNameDisplayNameAndAvatar(
    post.author
  );
  const queryClient = useQueryClient();

  const likePostMutation = useMutation({
    mutationFn: () => likePost(post.id),

    onError: (error) => {
      console.log("error", error);
      toast.error("Something want wrong");
    },

    onSettled: () => {
      // Invalidate post likes
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      // Invalidate post details to update like count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
    },
  });
  const unLikePostMutation = useMutation({
    mutationFn: () => unlikePost(post.id),

    onError: (error) => {
      console.log("error", error);
      toast.error("Something want wrong");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
    },
  });

  const handleToggleLike = async () => {
    if (post.isLikedByCurrentUser) {
      unLikePostMutation.mutate();
    } else {
      likePostMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
                {formatDistanceToNow(new Date(post.createdAt))}
              </p>
            </div>
          </div>

          <PostOptionsMenu post={post} />
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

          {post.subtitle && (
            <p className="text-muted-foreground text-sm">{post.subtitle}</p>
          )}

          <div className="flex flex-wrap gap-2 my-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag.value}
                asChild
                style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
              >
                <Link to={`/tags/${tag.value}`}>{tag.label}</Link>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 pt-4 text-sm">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1 h-auto p-1",
              post.isLikedByCurrentUser && "text-red-500 hover:text-red-500"
            )}
            onClick={handleToggleLike}
            disabled={
              likePostMutation.isPending || unLikePostMutation.isPending
            }
          >
            <Heart
              className={cn(post.isLikedByCurrentUser && "fill-red-500")}
            />
          </Button>

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
          <LikesDialog
            postId={post.id}
            likesCount={post.likesCount}
          />
          <CommentsDialog
            postId={post.id}
            commentsCount={post.commentsCount}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
