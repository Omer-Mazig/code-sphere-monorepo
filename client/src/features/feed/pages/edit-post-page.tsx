import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetPostForEdit, useUpdatePost } from "../hooks/posts/posts.hooks";
import { CreatePostInput } from "../schemas/post.schema";
import { toast } from "sonner";
import { PostForm } from "../components/post-form/post-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: protect this route. Only allow the user to edit their own posts (first implement the backend)
export default function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Use the specialized hook for editing posts
  const postQuery = useGetPostForEdit(id as string);

  const updatePostMutation = useUpdatePost(id as string);

  function onSubmit(values: CreatePostInput) {
    updatePostMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Post updated successfully");
        navigate(`/posts/${id}`);
      },
      onError: (error) => {
        console.error("Error updating post:", error);
        toast.error("Failed to update post");
      },
    });
  }

  if (postQuery.data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Edit Post</h1>
          <Button
            type="submit"
            disabled={updatePostMutation.isPending}
          >
            {updatePostMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            Update Post
          </Button>
        </div>
        <PostForm
          defaultValues={{
            title: postQuery.data.title,
            subtitle: postQuery.data.subtitle,
            tags: postQuery.data.tags.map((tag) => tag.value),
            contentBlocks: postQuery.data.contentBlocks,
            status: postQuery.data.status,
          }}
          onSubmit={onSubmit}
          onCancel={() => navigate(`/posts/${id}`)}
          isLoading={updatePostMutation.isPending}
        />
      </div>
    );
  }

  if (postQuery.isError) {
    if ("status" in postQuery.error && postQuery.error.status === 403) {
      return <Navigate to="/feed" />;
    }

    const errorMessage =
      "status" in postQuery.error && postQuery.error.status === 404
        ? "Could not find post. It might have been deleted."
        : "Failed to load post. Please try again later.";

    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{errorMessage}</p>
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
  if (postQuery.isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" /> {/* Page title */}
          <Skeleton className="h-10 w-32" /> {/* Update button */}
        </div>

        <div className="space-y-6">
          <Skeleton className="h-12 w-full" /> {/* Title input */}
          <Skeleton className="h-12 w-full" /> {/* Subtitle input */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" /> {/* Tags label */}
            <Skeleton className="h-12 w-full" /> {/* Tags input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" /> {/* Content blocks label */}
            <Skeleton className="h-14 w-full" /> {/* Content block 1 */}
            <Skeleton className="h-14 w-full" /> {/* Content block 2 */}
            <Skeleton className="h-14 w-full" /> {/* Content block 3 */}
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" /> {/* Cancel button */}
            <Skeleton className="h-10 w-32" /> {/* Submit button */}
          </div>
        </div>
      </div>
    );
  }
}
