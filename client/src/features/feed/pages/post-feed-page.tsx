import { useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PostCard from "@/features/feed/components/post-card";
import PostFeedSort from "@/features/feed/components/post-feed-sort";
import { useGetPosts } from "../hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortType = "latest" | "popular";

const PostFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  const activeSort = (searchParams.get("sort") as SortType) || "latest";
  const tag = searchParams.get("tag") || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetPosts(activeSort, tag || undefined);

  const handleSortChange = (newSort: SortType) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", newSort);
      return newParams;
    });
  };

  // Set up intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px 400px 0px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{tag ? `#${tag}` : "Feed"}</h1>
          <PostFeedSort
            currentFilter={activeSort}
            onFilterChange={handleSortChange}
          />
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading posts: {error.message}</p>
      </div>
    );
  }

  // Flatten all pages of posts into a single array
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{tag ? `#${tag}` : "Feed"}</h1>
        <PostFeedSort
          currentFilter={activeSort}
          onFilterChange={handleSortChange}
        />
      </div>

      <div className="space-y-4">
        {allPosts.length > 0 ? (
          <>
            {allPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}

            {/* Loading indicator for next page */}
            {isFetchingNextPage && (
              <div className="py-4 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  Loading more posts...
                </p>
              </div>
            )}

            {/* Manual load more button as fallback */}
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

            {/* Invisible element for intersection observer */}
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
    </div>
  );
};

export default PostFeedPage;
