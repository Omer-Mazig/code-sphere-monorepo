import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlockHeaderProps {
  type: string;
  onRemove: () => void;
}

export const BlockHeader = ({ type, onRemove }: BlockHeaderProps) => (
  <div className="absolute top-3 right-3 flex items-center gap-2">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onRemove}
      className="h-7 w-7"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);
