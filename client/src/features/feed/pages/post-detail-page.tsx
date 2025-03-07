import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentList from "@/features/feed/components/comment-list";
import CommentForm from "@/features/feed/components/comment-form";
import ReactMarkdown from "react-markdown";
import { useGetPost } from "../hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import LikeButton from "../components/like-button";
import CommentButton from "../components/comment-button";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useGetPost(id || "");

  // Generate display name from first name and last name or use email as fallback
  const displayName = post?.author
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
      post.author.email.split("@")[0]
    : "Anonymous";

  // Generate avatar fallback from display name
  const avatarFallback = displayName.slice(0, 2).toUpperCase();

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

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-red-500">Error loading post: {error.message}</p>
      </div>
    );
  }

  if (!post) {
    return <div className="flex justify-center p-8">Post not found</div>;
  }

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
};

export default PostDetailPage;
