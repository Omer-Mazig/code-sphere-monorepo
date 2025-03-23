import { useNavigate, useParams } from "react-router-dom";
import { useGetPost } from "../hooks/usePosts";
import { CreatePostInput } from "../schemas/post.schema";
import { toast } from "sonner";
import { PostForm } from "../components/post-form/post-form";

export default function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch the post data
  const { data: post, isLoading, isError } = useGetPost(id || "");

  function onSubmit(values: CreatePostInput) {
    // Just log the values for now
    console.log("Updating post with values:", values);
    toast.success("Post update functionality coming soon");
    navigate("/feed");
  }

  if (post) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Edit Post</h1>
        <PostForm
          defaultValues={{
            title: post.title,
            subtitle: post.subtitle,
            tags: post.tags.map((tag) => tag.value),
            contentBlocks: post.contentBlocks,
            status: post.status,
          }}
          onSubmit={onSubmit}
          onCancel={() => navigate(`/posts/${id}`)}
          submitLabel="Update Post"
          isLoading={false}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>Failed to load post or post not found.</p>
        <button
          onClick={() => navigate("/feed")}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  // Handle loading and error states
  if (isLoading) {
    return <div className="p-8 text-center">Loading post...</div>;
  }
}
