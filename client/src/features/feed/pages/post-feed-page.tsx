import { useSearchParams } from "react-router-dom";
import PostFeedSort from "@/features/feed/components/post-feed-sort";
import { useGetPosts } from "../hooks/usePosts";
import {
  PostFeedList,
  PostFeedListSkeleton,
  PostFeedListError,
} from "../components/post-feed-list";

type SortType = "latest" | "popular";

const PostFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

      {data && (
        <PostFeedList
          allPosts={allPosts}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}

      {isLoading && <PostFeedListSkeleton />}

      {/* We can have data and error at the same time. if we have both, we don't want to show the error */}
      {error && !data && <PostFeedListError />}
    </div>
  );
};

export default PostFeedPage;
