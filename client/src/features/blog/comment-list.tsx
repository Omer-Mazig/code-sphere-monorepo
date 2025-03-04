import { useState, useEffect } from "react";
import { comments } from "@/lib/mock-data";
import { Comment } from "@/types";
import { formatDistanceToNow } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const [postComments, setPostComments] = useState<Comment[]>([]);

  useEffect(() => {
    // In a real app, we would fetch comments from the API
    // For now, we'll filter our mock data
    if (comments) {
      setPostComments(comments.filter((comment) => comment.postId === postId));
    } else {
      setPostComments([]);
    }
  }, [postId]);

  return (
    <div className="space-y-6">
      {postComments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        postComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
          />
        ))
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

const CommentItem = ({ comment, isReply = false }: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  useEffect(() => {
    // In a real app, we would fetch replies from the API
    // For now, we'll filter our mock data
    if (comments) {
      setReplies(comments.filter((c) => c.parentId === comment.id));
    } else {
      setReplies([]);
    }
  }, [comment.id]);

  return (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author?.avatarUrl}
            alt={comment.author?.username}
          />
          <AvatarFallback>
            {comment.author?.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/users/${comment.author?.username}`}
                className="text-sm font-medium hover:underline"
              >
                {comment.author?.username}
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
              className="flex items-center gap-1 h-auto p-1"
            >
              <Heart className="h-4 w-4" />
              <span>{comment.likesCount}</span>
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
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
