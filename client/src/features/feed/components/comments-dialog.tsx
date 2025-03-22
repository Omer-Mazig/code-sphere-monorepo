import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CommentsDialogProps {
  postId: string;
  commentsCount: number;
}

export const CommentsDialog = ({
  postId,
  commentsCount,
}: CommentsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
        >
          <MessageCircleIcon className="h-4 w-4" />
          <span>{commentsCount} comments</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>People who commented on this post</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Empty state - fetching functionality to be implemented later */}
          <p className="text-center text-muted-foreground">
            {commentsCount > 0 ? "Loading comments..." : "No comments yet"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
