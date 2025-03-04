import { useParams, useSearchParams } from "react-router-dom";
import { posts } from "@/lib/mock-data";
import PostCard from "@/features/feed/components/post-card";
import PostFeedFilter from "@/features/feed/components/post-feed-filter";

type FilterType = "latest" | "popular" | "following";

const PostFeedPage = () => {
  const { tag } = useParams<{ tag?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter from search params or default to "latest"
  const activeFilter = (searchParams.get("filter") as FilterType) || "latest";

  // Handle filter change
  const handleFilterChange = (newFilter: FilterType) => {
    // Update search params with the new filter
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", newFilter);
      return newParams;
    });
  };

  // Filter and sort posts based on filter and tag
  const filteredPosts = [...posts]
    .filter((post) => {
      // If tag is specified, only show posts with that tag
      if (tag) {
        return post.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === "latest") {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      } else if (activeFilter === "popular") {
        return b.views - a.views;
      }
      // For 'following', we would filter by followed users in a real app
      // For now, just return the same as latest
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{tag ? `#${tag}` : "Feed"}</h1>
        <PostFeedFilter
          currentFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFeedPage;
