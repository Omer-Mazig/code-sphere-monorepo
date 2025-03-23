import { Button } from "@/components/ui/button";
import { ContentBlockType } from "../../../../../../shared/types/posts.types";
import { AlertTriangle, Code, Heading2, Image } from "lucide-react";

interface BlockTypeButtonsProps {
  onAddBlock: (type: ContentBlockType) => void;
}

export const BlockTypeButtons = ({ onAddBlock }: BlockTypeButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddBlock("paragraph")}
      >
        <Heading2 className="w-4 h-4 mr-1" /> Add Paragraph
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddBlock("heading")}
      >
        <Heading2 className="w-4 h-4 mr-1" /> Add Heading
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddBlock("code")}
      >
        <Code className="w-4 h-4 mr-1" /> Add Code Block
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddBlock("image")}
      >
        <Image className="w-4 h-4 mr-1" /> Add Image
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddBlock("alert")}
      >
        <AlertTriangle className="w-4 h-4 mr-1" /> Add Alert
      </Button>
    </div>
  );
};
