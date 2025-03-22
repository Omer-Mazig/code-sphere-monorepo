import { UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LikesDialogProps {
  postId: string;
  likesCount: number;
}

export const LikesDialog = ({ postId, likesCount }: LikesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
        >
          <UsersIcon className="h-4 w-4" />
          <span>{likesCount} likes</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>People who liked this post</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* Empty state - fetching functionality to be implemented later */}
          <p className="text-center text-muted-foreground">
            {likesCount > 0 ? "Loading likes..." : "No likes yet"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
