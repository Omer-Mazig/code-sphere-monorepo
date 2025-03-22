import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CommentButtonProps {
  postId: string;
  count: number;
}

const CommentButton = ({ postId, count }: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("flex items-center gap-1 h-auto p-1")}
      asChild
    >
      <Link to={`/posts/${postId}`}>
        <MessageSquare />
        <span>{count}</span>
      </Link>
    </Button>
  );
};

export default CommentButton;
