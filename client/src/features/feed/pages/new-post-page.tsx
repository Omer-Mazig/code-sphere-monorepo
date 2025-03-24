import { useNavigate } from "react-router-dom";
import { CreatePostInput } from "../schemas/post.schema";
import { useCreatePost } from "../hooks/posts/posts.hooks";
import { toast } from "sonner";
import { PostForm } from "../components/post-form/post-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
export default function NewPostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [postStatus, setPostStatus] = useState<
    "published" | "draft" | "scheduled"
  >("published");
  const [formValues, setFormValues] = useState<CreatePostInput | null>(null);

  function onSubmit(values: CreatePostInput) {
    setFormValues(values);
    setShowStatusDialog(true);
  }

  function handleConfirmSubmit() {
    if (!formValues) return;

    createPostMutation.mutate(
      {
        ...formValues,
        status: postStatus,
      },
      {
        onSuccess: () => {
          setShowStatusDialog(false);
          navigate("/feed");
          toast.success("Post created successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">New Post</h1>
      </div>
      <PostForm
        onSubmit={onSubmit}
        onCancel={() => navigate("/feed")}
        submitLabel="Create Post"
      />

      <Dialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Post Status</DialogTitle>
            <DialogDescription>
              Choose how you want to publish your post
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={postStatus === "published" ? "default" : "outline"}
                  onClick={() => setPostStatus("published")}
                  className="w-full"
                >
                  Publish Now
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={postStatus === "draft" ? "default" : "outline"}
                  onClick={() => setPostStatus("draft")}
                  className="w-full"
                >
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={createPostMutation.isPending}
              onClick={() => {
                handleConfirmSubmit();
              }}
            >
              {createPostMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
