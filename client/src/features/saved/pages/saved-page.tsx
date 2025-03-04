import { useState } from "react";
import { Search } from "lucide-react";
import { bookmarks } from "@/lib/mock-data";
import SavedPostCard from "@/features/saved/saved-post-card";

const SavedPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from bookmarks
  const categories = Array.from(
    new Set(
      bookmarks
        .filter((bookmark) => bookmark.category)
        .map((bookmark) => bookmark.category as string)
    )
  );

  // Add "All" category
  const allCategories = ["All", ...categories];

  // Filter bookmarks based on search query and selected category
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      !searchQuery ||
      bookmark.post?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.post?.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      bookmark.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Saved Posts</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category === "All" ? null : category)
            }
            className={`px-4 py-2 rounded-full text-sm ${
              (category === "All" && !selectedCategory) ||
              category === selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Saved Posts */}
      <div className="space-y-6">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((bookmark) => (
            <SavedPostCard
              key={bookmark.id}
              bookmark={bookmark}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery || selectedCategory
              ? "No saved posts match your filters"
              : "You haven't saved any posts yet"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
