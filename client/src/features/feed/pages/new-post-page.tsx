import { useNavigate } from "react-router-dom";
import { CreatePostInput } from "../schemas/post.schema";
import { useCreatePost } from "../hooks/posts/posts.hooks";
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
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">New Post</h1>
      </div>
      <PostForm
        onSubmit={onSubmit}
        onCancel={() => navigate("/feed")}
        isLoading={createPostMutation.isPending}
        submitLabel="Create Post"
      />
    </div>
  );
}
