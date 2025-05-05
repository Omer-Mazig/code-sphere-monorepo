import { Bookmark, Heart, Share2 } from "lucide-react";
import { formatDistanceToNow } from "shared/utils/dates.utils";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post } from "../schemas/post.schema";
import { CommentButton } from "./comment-button";
import { LikesDialog } from "./likes-dialog";
import { CommentsDialog } from "./comments-dialog";
import { PostOptionsMenu } from "./post-options-menu";
import { cn, getUserNameDisplayNameAndAvatar } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, ReactNode } from "react";
import { useTogglePostLike } from "../hooks/likes/like-mutations";

// Context for sharing post data between compound components
interface PostCardContextType {
  post: Post;
  user: any;
  displayName: string;
  avatarFallback: string;
  profileLink: string;
  handleToggleLike: () => void;
}

const PostCardContext = createContext<PostCardContextType | null>(null);

// Hook to use PostCard context
const usePostCard = () => {
  const context = useContext(PostCardContext);
  if (!context) {
    throw new Error(
      "PostCard compound components must be used within a PostCard"
    );
  }
  return context;
};

// Main component
interface PostCardProps {
  post: Post;
  children?: ReactNode;
}

const PostCardRoot = ({ post, children }: PostCardProps) => {
  const { user } = useUser();

  const { displayName, avatarFallback } = getUserNameDisplayNameAndAvatar(
    post.author
  );

  const toggleLikeMutation = useTogglePostLike(
    post.isLikedByCurrentUser ? "unlike" : "like"
  );

  const handleToggleLike = async () => {
    toggleLikeMutation.mutate(post.id, {
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };

  const profileLink =
    user?.id === post.author.clerkId
      ? "/me/profile"
      : `/profile/${post.author.id}`;

  // Create the context value
  const contextValue = {
    post,
    user,
    displayName,
    avatarFallback,
    profileLink,
    handleToggleLike,
  };

  return (
    <PostCardContext.Provider value={contextValue}>
      <Card>{children}</Card>
    </PostCardContext.Provider>
  );
};

// Header component
const Header = ({ children }: { children?: ReactNode }) => {
  return <CardHeader>{children}</CardHeader>;
};

// Author component with avatar
const Author = () => {
  const { post, displayName, avatarFallback, profileLink } = usePostCard();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage
            src={post.author.profileImageUrl ?? undefined}
            alt={displayName}
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={profileLink}
            className="font-medium hover:underline"
          >
            {displayName}
          </Link>
          <p className="text-xs text-muted-foreground">Title</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt))}
          </p>
        </div>
      </div>
      <PostOptionsMenu post={post} />
    </div>
  );
};

// Content component
const Content = () => {
  const { post } = usePostCard();

  return (
    <CardContent>
      <div className="space-y-2">
        <Link
          to={`/posts/${post.id}`}
          className="hover:underline"
        >
          <h2 className="text-xl font-bold tracking-tight">{post.title}</h2>
        </Link>

        {post.subtitle && (
          <p className="text-muted-foreground text-sm">{post.subtitle}</p>
        )}

        <div className="flex flex-wrap gap-2 my-3">
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
      </div>
    </CardContent>
  );
};

// Actions component
const Actions = () => {
  const { post, handleToggleLike } = usePostCard();

  return (
    <CardFooter className="flex items-center justify-between border-t px-4 pt-4 text-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 h-auto p-1",
            post.isLikedByCurrentUser && "text-red-500 hover:text-red-500"
          )}
          onClick={handleToggleLike}
        >
          <Heart className={cn(post.isLikedByCurrentUser && "fill-red-500")} />
        </Button>

        <CommentButton postId={post.id} />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <LikesDialog
          postId={post.id}
          likesCount={post.likesCount}
        />
        <CommentsDialog
          postId={post.id}
          commentsCount={post.commentsCount}
        />
      </div>
    </CardFooter>
  );
};

// Assemble the compound component
export const PostCard = Object.assign(PostCardRoot, {
  Header,
  Author,
  Content,
  Actions,
});
