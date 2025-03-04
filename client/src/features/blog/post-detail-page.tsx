import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { posts } from "@/lib/mock-data";
import { Post } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentList from "./comment-list";
import CommentForm from "./comment-form";
import ReactMarkdown from "react-markdown";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the post data from the API
    // For now, we'll use our mock data
    const foundPost = posts.find((p) => p.id === id);
    setPost(foundPost || null);
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
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
            src={post.author?.avatarUrl}
            alt={post.author?.username}
          />
          <AvatarFallback>
            {post.author?.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={`/users/${post.author?.username}`}
            className="text-sm font-medium hover:underline"
          >
            {post.author?.username}
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
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-auto p-1"
          >
            <Heart className="h-5 w-5" />
            <span>{post.likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-auto p-1"
          >
            <MessageSquare className="h-5 w-5" />
            <span>{post.commentsCount}</span>
          </Button>
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
