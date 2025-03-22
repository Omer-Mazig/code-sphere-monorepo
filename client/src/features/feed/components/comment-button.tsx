import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CommentButtonProps {
  postId: string;
}

export const CommentButton = ({ postId }: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("flex items-center gap-1 h-auto p-1")}
      asChild
    >
      <Link to={`/posts/${postId}`}>
        <MessageSquare />
      </Link>
    </Button>
  );
};
