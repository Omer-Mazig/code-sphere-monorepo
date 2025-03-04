import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { posts } from "@/lib/mock-data";
import PostCard from "@/features/feed/components/post-card";
import PostFeedFilter from "@/features/feed/components/post-feed-filter";

type FilterType = "latest" | "popular" | "following";

const PostFeedPage = () => {
  const { filter, tag } = useParams<{ filter?: string; tag?: string }>();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("latest");

  // Set the filter based on URL parameter or default to "latest"
  useEffect(() => {
    if (filter && ["latest", "popular", "following"].includes(filter)) {
      setActiveFilter(filter as FilterType);
    } else if (!tag) {
      // Only navigate if we're not on a tag page
      setActiveFilter("latest");
    }
  }, [filter, tag]);

  // Handle filter change
  const handleFilterChange = (newFilter: FilterType) => {
    setActiveFilter(newFilter);
    navigate(`/feed/${newFilter}`);
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
        <h1 className="text-2xl font-bold tracking-tight">
          {tag ? `#${tag}` : "Feed"}
        </h1>
        {!tag && (
          <PostFeedFilter
            currentFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        )}
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
