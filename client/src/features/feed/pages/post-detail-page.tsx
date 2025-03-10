import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Share2, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentList from "@/features/feed/components/comment-list";
import CommentForm from "@/features/feed/components/comment-form";
import ReactMarkdown from "react-markdown";
import { useGetPost } from "../hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "../components/like-button";
import CommentButton from "../components/comment-button";
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

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error, refetch } = useGetPost(id || "");

  // Generate display name from first name and last name or use email as fallback
  const displayName = post?.author
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
      post.author.email.split("@")[0]
    : "Anonymous";

  // Generate avatar fallback from display name
  const avatarFallback = displayName.slice(0, 2).toUpperCase();

  if (post) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              asChild
            >
              <Link to={`/tags/${tag.toLowerCase()}`}>{tag}</Link>
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 mb-8">
          <Avatar>
            <AvatarImage
              src={undefined} // We don't have avatarUrl in our API yet
              alt={displayName}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/users/${post.author?.id}`}
              className="text-sm font-medium hover:underline"
            >
              {displayName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.publishedAt))} • {post.views}{" "}
              views
            </p>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="flex items-center justify-between border-t border-b py-4 my-8">
          <div className="flex items-center gap-4">
            <LikeButton
              postId={post.id}
              count={post.likesCount || 0}
              isLiked={post.isLikedByCurrentUser}
              variant="medium"
            />
            <CommentButton
              postId={post.id}
              count={post.commentsCount || 0}
              variant="medium"
            />
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

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Comments</h2>
          <CommentForm postId={post.id} />
          <CommentList postId={post.id} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
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
    if (error.response?.status === 404) {
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

export default PostDetailPage;
