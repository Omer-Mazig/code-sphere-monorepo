import { useState } from "react";
import { currentUser } from "@/lib/mock-data";

interface CommentFormProps {
  postId: string;
  parentId?: string;
}

const CommentForm = ({ postId, parentId }: CommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit the comment to the server
    console.log("Submitting comment:", { postId, parentId, comment });
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.username}
          className="h-8 w-8 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!comment.trim()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
