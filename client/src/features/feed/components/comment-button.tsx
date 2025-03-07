import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CommentButtonProps {
  postId: string;
  count: number;
  variant?: "small" | "medium";
}

const CommentButton = ({
  postId,
  count,
  variant = "small",
}: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-1 h-auto",
        variant === "small" ? "p-1" : "p-2"
      )}
      asChild
    >
      <Link to={`/posts/${postId}`}>
        <MessageSquare
          className={cn(variant === "small" ? "h-4 w-4" : "h-5 w-5")}
        />
        <span>{count}</span>
      </Link>
    </Button>
  );
};

export default CommentButton;
