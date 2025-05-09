import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "shared/utils/dates.utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Share2, FileX, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentList from "@/features/feed/components/comment-list";
import CommentForm from "@/features/feed/components/comment-form";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentButton } from "../components/comment-button";
import { ContentBlockRenderer } from "../components/content-block-renderer";
import { cn, getUserNameDisplayNameAndAvatar } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { postQueries } from "../hooks/posts/post-queries";
import { useTogglePostLike } from "../hooks/likes/like-mutations";
const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useQuery(postQueries.detail(id as string));

  const toggleLikeMutation = useTogglePostLike(
    post?.isLikedByCurrentUser ? "unlike" : "like"
  );

  const handleToggleLike = async () => {
    if (!post) return;

    toggleLikeMutation.mutate(post.id, {
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  if (post) {
    const { displayName, avatarFallback } = getUserNameDisplayNameAndAvatar(
      post.author
    );

    return (
      <div className="lg:max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>

        {post.subtitle && (
          <p className="text-xl text-muted-foreground mb-6">{post.subtitle}</p>
        )}

        <div className="flex items-center gap-2 mb-8">
          <Avatar className="size-10">
            <AvatarImage
              src={post.author.profileImageUrl ?? undefined} // We don't have avatarUrl in our API yet
              alt={displayName}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <div>
              <Link
                to={`/users/${post.author?.id}`}
                className="text-sm font-medium hover:underline"
              >
                {displayName}
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">Title</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt))} • {post.views}{" "}
              views
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-b py-4 my-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 h-auto p-1",
                post.isLikedByCurrentUser && "text-red-500 hover:text-red-500"
              )}
              onClick={handleToggleLike}
            >
              <Heart
                className={cn(post.isLikedByCurrentUser && "fill-red-500")}
              />
            </Button>
            <CommentButton postId={post.id} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.contentBlocks?.map((block) => (
            <ContentBlockRenderer
              key={block.id}
              block={block}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge
              key={tag.value}
              asChild
              style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
            >
              <Link to={`/tags/${tag.value}`}>{tag.label}</Link>
            </Badge>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Comments ({post.commentsCount})
          </h2>
          <CommentForm postId={post.id} />
          <CommentList postId={post.id} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="lg:max-w-2xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-3/4" />
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Show the 404 component for both error cases and when post is not found
  if (error) {
    // If it's a 404 error, show the dedicated not found page
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "status" in error.response &&
      error.response.status === 404
    ) {
      return <PostNotFound />;
    }

    // For other errors, show a generic error message
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500">
          Something went wrong. Please try again later.
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }
};

// 404 Not Found Component
const PostNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <FileX className="w-16 h-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Post Not Found</h1>
      <p className="text-muted-foreground text-center max-w-md">
        The post you're looking for doesn't exist or has been removed.
      </p>

      <Button asChild>
        <Link to="/feed">Back to Feed</Link>
      </Button>
    </div>
  );
};

export default PostDetailPage;
