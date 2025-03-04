import { useParams, useSearchParams } from "react-router-dom";
import PostCard from "@/features/feed/components/post-card";
import PostFeedSort from "@/features/feed/components/post-feed-sort";
import { useGetPosts } from "../hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

type SortType = "latest" | "popular";

const PostFeedPage = () => {
  const { tag } = useParams<{ tag?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSort = (searchParams.get("sort") as SortType) || "latest";

  const { data: posts, isLoading, error } = useGetPosts(activeSort, tag);

  const handleSortChange = (newSort: SortType) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", newSort);
      return newParams;
    });
  };

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
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
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
