import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const WriteButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex items-center"
      asChild
    >
      <Link to="/posts/new">
        <PenSquare className="h-4 w-4 mr-1" />
        <span>Write</span>
      </Link>
    </Button>
  );
};
