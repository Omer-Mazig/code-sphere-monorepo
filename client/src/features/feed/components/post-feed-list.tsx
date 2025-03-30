import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "../schemas/post.schema";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { InfiniteData } from "@tanstack/react-query";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Pagination } from "shared/schemas/pagination.schema";

type PostFeedListProps = {
  allPosts: Post[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
};

export function PostFeedList({
  allPosts,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: PostFeedListProps) {
  const { observerTarget } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="space-y-4">
      {allPosts.length > 0 ? (
        <>
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}

          {isFetchingNextPage && (
            <div className="py-4 text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading more posts...
              </p>
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
              >
                Load More
              </Button>
            </div>
          )}

          <div
            ref={observerTarget}
            className="h-4"
          />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts found</p>
        </div>
      )}
    </div>
  );
}

export function PostFeedListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="space-y-3"
        >
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      ))}
    </div>
  );
}

export function PostFeedListError({
  refetch,
}: {
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      InfiniteData<
        {
          items: Post[];
          pagination: Pagination;
        },
        unknown
      >,
      unknown
    >
  >;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p className="text-red-500">
        Something went wrong. Please try again later.
      </p>
      <Button onClick={() => refetch()}>Try again</Button>
    </div>
  );
}
