import { MoreVertical, Flag, Edit, Trash2, Archive, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Post } from "../schemas/post.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { toast } from "sonner";
interface PostOptionsMenuProps {
  post: Post;
}

export const PostOptionsMenu = ({ post }: PostOptionsMenuProps) => {
  const { user } = useUser();
  const isCurrentUserPost = user?.id === post.author?.clerkId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    console.log("delete confirmed");
    // Here you would implement the actual deletion logic
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Flag className="mr-2 h-4 w-4" />
            <span>Report</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          {isCurrentUserPost && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        title="Delete Post"
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        description="This will permanently delete the post and all of its comments."
      />
    </>
  );
};
