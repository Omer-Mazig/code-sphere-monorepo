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
import { useRef, useState } from "react";

interface PostCardProps {
  post: Post;
}
import { Pagination } from "@/features/schemas/pagination.schema";

export const PostCard = ({ post }: PostCardProps) => {
  const { displayName, avatarFallback } = getUserNameDisplayNameAndAvatar(
    post.author
  );
  const queryClient = useQueryClient();
  const pendingLikeActionRef = useRef(false);
  // State to track the optimistic UI state separately from post.isLikedByCurrentUser
  const [isOptimisticallyLiked, setIsOptimisticallyLiked] = useState(
    post.isLikedByCurrentUser
  );

  const likePostMutation = useMutation({
    mutationFn: () => likePost(post.id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(post.id) });

      queryClient.setQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }), (oldData) => {
        if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) {
          return oldData;
        }

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((p) =>
                p.id === post.id
                  ? {
                      ...p,
                      isLikedByCurrentUser: true,
                      likesCount: (p.likesCount || 0) + 1,
                    }
                  : p
              ),
            };
          }),
        };

        return newData;
      });
    },

    onError: (error) => {
      console.log("error", error);
      toast.error("Something went wrong");
      // Reset optimistic state on error
      setIsOptimisticallyLiked(post.isLikedByCurrentUser);
    },

    onSettled: () => {
      // Reset the pending action flag when the mutation completes
      pendingLikeActionRef.current = false;
      // Invalidate post likes
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      // Invalidate post details to update like count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
    },
  });

  const unLikePostMutation = useMutation({
    mutationFn: () => unlikePost(post.id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(post.id) });

      queryClient.setQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }), (oldData) => {
        if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) {
          return oldData;
        }

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((p) =>
                p.id === post.id
                  ? {
                      ...p,
                      isLikedByCurrentUser: false,
                      likesCount: (p.likesCount || 0) - 1,
                    }
                  : p
              ),
            };
          }),
        };

        return newData;
      });
    },

    onError: (error) => {
      console.log("error", error);
      toast.error("Something went wrong");
      // Reset optimistic state on error
      setIsOptimisticallyLiked(post.isLikedByCurrentUser);
    },

    onSettled: () => {
      // Reset the pending action flag when the mutation completes
      pendingLikeActionRef.current = false;
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
    },
  });

  const handleToggleLike = async () => {
    // Immediately toggle the optimistic UI state
    const newLikedState = !isOptimisticallyLiked;
    setIsOptimisticallyLiked(newLikedState);

    // If there's already a pending action, don't trigger a new API call
    // Just let the UI update optimistically and wait for the ongoing request
    if (pendingLikeActionRef.current) return;

    // Set the flag to indicate a pending action
    pendingLikeActionRef.current = true;

    // Make the appropriate API call based on the NEW state
    if (newLikedState) {
      likePostMutation.mutate();
    } else {
      unLikePostMutation.mutate();
    }
  };

  // Use the optimistic state for rendering, not the post state
  const isLiked = isOptimisticallyLiked;

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
              isLiked && "text-red-500 hover:text-red-500"
            )}
            onClick={handleToggleLike}
            disabled={false}
          >
            <Heart className={cn(isLiked && "fill-red-500")} />
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
