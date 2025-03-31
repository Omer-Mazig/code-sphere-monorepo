import { UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { getUserNameDisplayNameAndAvatar } from "@/lib/utils";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { usePostCommentsForDialog } from "../hooks/comments/comments.hooks";
interface CommentsDialogProps {
  postId: string;
  commentsCount: number;
}

export const CommentsDialog = ({
  postId,
  commentsCount,
}: CommentsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    usePostCommentsForDialog(postId, isOpen);

  const { observerTarget } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const comments = data?.pages.flatMap((page) => page.items) || [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
        >
          <UsersIcon className="h-4 w-4" />
          <span>{commentsCount} Comments</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>People who comment this post</DialogTitle>

          <DialogDescription className="sr-only">
            Browse through the people who comment this post
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comments) => {
                if (!comments.user) return null;

                const { displayName, avatarFallback } =
                  getUserNameDisplayNameAndAvatar(comments.user);
                return (
                  <div
                    key={comments.id}
                    className="flex justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={comments.user.profileImageUrl || undefined}
                          alt={displayName}
                        />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          to={`/profile/${comments.user.id}`}
                          className="font-medium hover:underline"
                        >
                          {displayName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {comments.user.username
                            ? `@${comments.user.username}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <Button variant="ghost">Follow</Button>
                  </div>
                );
              })}

              {/* Infinite scroll trigger element */}
              {hasNextPage && (
                <div
                  ref={observerTarget}
                  className="py-2"
                >
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No comments yet</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
