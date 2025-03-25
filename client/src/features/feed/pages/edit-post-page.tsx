import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetPostForEdit, useUpdatePost } from "../hooks/posts/posts.hooks";
import { CreatePostInput } from "../schemas/post.schema";
import { toast } from "sonner";
import { PostForm } from "../components/post-form/post-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function EditPostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
          submitLabel="Update Post"
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

  if (postQuery.isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" /> {/* Page title */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6">
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
          </div>

          {/* Skeleton for sidebar cards - hidden on small screens */}
          <div className="hidden md:block">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" /> {/* Card title */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />{" "}
                    {/* Add Content label */}
                    <div className="grid grid-cols-3 gap-2">
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                      <Skeleton className="h-16 w-full" />{" "}
                      {/* Content type button */}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-10 w-full" /> {/* Cancel button */}
                    <Skeleton className="h-10 w-full" /> {/* Submit button */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Skeleton for floating button on small screens */}
        <div className="fixed bottom-4 right-4 md:hidden">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    );
  }
}
