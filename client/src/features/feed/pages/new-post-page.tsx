// React imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Third party imports
import { toast } from "sonner";

// Local components
import { PostForm } from "../components/post-form/post-form";
import { PostConfirmationDialog } from "../components/post-confirmation-dialog";

// Types & Hooks
import { CreatePostInput } from "../schemas/post.schema";
import { useCreatePost } from "../hooks/posts/posts.hooks";
import { PostStatus } from "../../../../../shared/types/posts.types";

export default function NewPostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [formValues, setFormValues] = useState<CreatePostInput | null>(null);

  function onSubmit(values: CreatePostInput) {
    setFormValues(values);
    setShowStatusDialog(true);
  }

  function handleConfirmSubmit(status: PostStatus, date?: Date) {
    if (!formValues) return;

    createPostMutation.mutate(
      {
        ...formValues,
        status,
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
        submitLabel="Done"
      />

      <PostConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmSubmit}
        isPending={createPostMutation.isPending}
      />
    </div>
  );
}
