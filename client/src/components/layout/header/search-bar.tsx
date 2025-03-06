import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-lg lg:max-w-xl relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts, users, or tags..."
        className="w-full pl-9"
      />
    </div>
  );
};
