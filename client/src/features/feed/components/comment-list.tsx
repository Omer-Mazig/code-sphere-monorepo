import { useState } from "react";
import { formatDistanceToNow } from "shared/utils/dates.utils";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply, MoreHorizontal, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment } from "../schemas/comment.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCommentsForPostDetail } from "../hooks/comments/comments.hooks";
import { cn, getUserNameDisplayNameAndAvatar } from "@/lib/utils";
interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const {
    data: comments,
    isLoading,
    error,
  } = useGetCommentsForPostDetail(postId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading comments: {error.message}
      </div>
    );
  }

  // Filter top-level comments (those without a parentId)
  const topLevelComments =
    comments?.filter((comment: Comment) => !comment.parentId) || [];

  return (
    <div className="space-y-6">
      {topLevelComments.length === 0 ? (
        <div className="text-center text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        topLevelComments.map((comment: Comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            allComments={comments || []}
          />
        ))
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  isReply?: boolean;
}

const CommentItem = ({
  comment,
  allComments,
  isReply = false,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);

  // Find replies for this comment
  const replies = allComments.filter((c) => c.parentId === comment.id);

  const { displayName, avatarFallback } = getUserNameDisplayNameAndAvatar(
    comment.author
  );

  return (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author.profileImageUrl ?? undefined}
            alt={displayName}
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/users/${comment.author?.id}`}
                className="text-sm font-medium hover:underline"
              >
                {displayName}
              </Link>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt))}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-sm">{comment.content}</div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-1 h-auto p-1",
                comment.isLikedByCurrentUser &&
                  "text-red-500 hover:text-red-500"
              )}
              onClick={() => {}}
              disabled={false}
            >
              <Heart
                className={cn(comment.isLikedByCurrentUser && "fill-red-500")}
              />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 h-auto p-1"
              onClick={() => setShowReplies(!showReplies)}
            >
              <Reply className="h-4 w-4" />
              <span>
                {replies.length > 0
                  ? `${replies.length} ${
                      replies.length === 1 ? "reply" : "replies"
                    }`
                  : "Reply"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
