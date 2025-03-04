import { Clock, TrendingUp, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PostFeedFilterProps {
  currentFilter: "latest" | "popular" | "following";
  onFilterChange: (filter: "latest" | "popular" | "following") => void;
}

const PostFeedFilter = ({
  currentFilter,
  onFilterChange,
}: PostFeedFilterProps) => {
  const [searchParams] = useSearchParams();

  const filters = [
    {
      id: "latest" as const,
      label: "Latest",
      icon: Clock,
    },
    {
      id: "popular" as const,
      label: "Popular",
      icon: TrendingUp,
    },
    {
      id: "following" as const,
      label: "Following",
      icon: Users,
    },
  ] as const;

  return (
    <Tabs
      value={currentFilter}
      onValueChange={onFilterChange as (value: string) => void}
    >
      <TabsList>
        {filters.map((filter) => {
          // Create new search params for this filter
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("filter", filter.id);

          return (
            <TabsTrigger
              key={filter.id}
              value={filter.id}
              className="flex items-center"
            >
              <div className="flex items-center">
                <filter.icon className="mr-2 h-4 w-4" />
                {filter.label}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default PostFeedFilter;
