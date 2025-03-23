import { useNavigate } from "react-router-dom";
import { CreatePostInput } from "../schemas/post.schema";
import { useCreatePost } from "../hooks/usePosts";
import { toast } from "sonner";
import { PostForm } from "../components/post-form/post-form";

export default function NewPostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  function onSubmit(values: CreatePostInput) {
    createPostMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Post created successfully");
        navigate("/feed");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">New Post</h1>
      <PostForm
        onSubmit={onSubmit}
        onCancel={() => navigate("/feed")}
        submitLabel="Create Post"
        isLoading={createPostMutation.isPending}
      />
    </div>
  );
}
