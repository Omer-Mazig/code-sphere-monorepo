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
import { PostStatus } from "shared/types/posts.types";
import { useCreatePost } from "../hooks/posts/post-mutations";

// TODO: add Confetti on onSuccess
// TODO: add confirm if the user try to leave this page as it writing a post
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

    date;

    createPostMutation.mutate(
      {
        ...formValues,
        status,
      },
      {
        onSuccess: (data) => {
          setShowStatusDialog(false);
          navigate(`/posts/${data.id}`);
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
