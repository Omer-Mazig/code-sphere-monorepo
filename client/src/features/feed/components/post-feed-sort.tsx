import { Clock, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sortOptions = [
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
] as const;

export const PostFeedSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSort = searchParams.get("sort") || "latest";

  const handleSortChange = (newSort: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", newSort);
      return newParams;
    });
  };

  return (
    <Tabs
      value={activeSort}
      onValueChange={handleSortChange as (value: string) => void}
    >
      <TabsList>
        {sortOptions.map((option) => {
          // Create new search params for this sort option
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("sort", option.id);

          return (
            <TabsTrigger
              key={option.id}
              value={option.id}
              className="flex items-center"
            >
              <div className="flex items-center">
                <option.icon className="mr-2 h-4 w-4" />
                {option.label}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
