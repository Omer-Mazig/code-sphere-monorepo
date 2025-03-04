import { Clock, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedFilterProps {
  currentFilter: "latest" | "popular" | "following";
  onFilterChange: (filter: "latest" | "popular" | "following") => void;
}

const FeedFilter = ({ currentFilter, onFilterChange }: FeedFilterProps) => {
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
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.id}
            value={filter.id}
            className="flex items-center"
            asChild
          >
            <Link to={`/feed/${filter.id}`}>
              <filter.icon className="mr-2 h-4 w-4" />
              {filter.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FeedFilter;
