import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useTogglePostLike,
  useToggleCommentLike,
} from "../hooks/likes/likes.hooks";

interface LikeButtonProps {
  postId?: string;
  commentId?: string;
  isLiked?: boolean;
}

export const LikeButton = ({
  postId,
  commentId,
  isLiked = false,
}: LikeButtonProps) => {
  // Use the appropriate toggle like hook based on whether we're liking a post or comment
  const togglePostLikeMutation = postId ? useTogglePostLike(postId) : undefined;
  const toggleCommentLikeMutation = commentId
    ? useToggleCommentLike(commentId)
    : undefined;

  const isPending =
    togglePostLikeMutation?.isPending || toggleCommentLikeMutation?.isPending;

  const handleToggleLike = async () => {
    try {
      if (postId && togglePostLikeMutation) {
        togglePostLikeMutation.mutate();
      } else if (commentId && toggleCommentLikeMutation) {
        toggleCommentLikeMutation.mutate();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-1 h-auto p-1",
        isLiked && "text-red-500 hover:text-red-500"
      )}
      onClick={handleToggleLike}
      disabled={isPending}
    >
      <Heart className={cn(isLiked && "fill-red-500")} />
    </Button>
  );
};
