import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PostForm } from "../components/post-form";
import { CreatePostInput } from "../schemas/post.schema";
import { useCreatePost } from "../hooks/usePosts";
import { toast } from "sonner";

export default function NewPostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  function onSubmit(values: CreatePostInput) {
    createPostMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Post created successfully");
        navigate("/feed");
      },
      onError: (error) => {
        console.error("Error creating post:", error);
      },
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">New Post</h1>
      <Card>
        <CardContent>
          <PostForm
            onSubmit={onSubmit}
            onCancel={() => navigate("/feed")}
            submitLabel="Create Post"
          />
        </CardContent>
      </Card>
    </div>
  );
}
