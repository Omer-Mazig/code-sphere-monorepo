import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WriteButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex items-center"
    >
      <PenSquare className="h-4 w-4 mr-1" />
      <span>Write</span>
    </Button>
  );
};
