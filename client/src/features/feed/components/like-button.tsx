import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTogglePostLike, useToggleCommentLike } from "../hooks/useLikes";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId?: string;
  commentId?: string;
  count: number;
  isLiked?: boolean;
  variant?: "small" | "medium";
}

const LikeButton = ({
  postId,
  commentId,
  count,
  isLiked = false,
  variant = "small",
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
        await togglePostLikeMutation.mutateAsync();
      } else if (commentId && toggleCommentLikeMutation) {
        await toggleCommentLikeMutation.mutateAsync();
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
        isLiked && "text-red-500"
      )}
      onClick={handleToggleLike}
      disabled={isPending}
    >
      <Heart
        className={cn(
          variant === "small" ? "h-4 w-4" : "h-5 w-5",
          isLiked && "fill-red-500"
        )}
      />
      <span>{count}</span>
    </Button>
  );
};

export default LikeButton;
