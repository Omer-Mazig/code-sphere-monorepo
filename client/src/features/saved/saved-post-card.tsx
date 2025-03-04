import { Bookmark, Heart, MessageSquare, Trash2 } from "lucide-react";
import { Bookmark as BookmarkType } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";

interface SavedPostCardProps {
  bookmark: BookmarkType;
}

const SavedPostCard = ({ bookmark }: SavedPostCardProps) => {
  const post = bookmark.post;

  if (!post) {
    return null;
  }

  const handleRemoveBookmark = () => {
    // In a real app, we would call an API to remove the bookmark
    console.log("Remove bookmark:", bookmark.id);
  };

  return (
    <article className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              <a
                href={`/posts/${post.id}`}
                className="hover:text-primary hover:underline"
              >
                {post.title}
              </a>
            </h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                Saved {formatDistanceToNow(new Date(bookmark.createdAt))}
              </span>
              {bookmark.category && (
                <>
                  <span className="mx-2">•</span>
                  <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                    {bookmark.category}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleRemoveBookmark}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remove bookmark"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {post.content
            .replace(/^#+\s+/gm, "") // Remove markdown headers
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .substring(0, 200)}
          {post.content.length > 200 && "..."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`/users/${post.author?.username}`}
              className="flex items-center gap-2 hover:underline"
            >
              <img
                src={post.author?.avatarUrl}
                alt={post.author?.username}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm font-medium">
                {post.author?.username}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.commentsCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4 fill-current" />
              <span className="text-xs">{post.bookmarksCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SavedPostCard;
