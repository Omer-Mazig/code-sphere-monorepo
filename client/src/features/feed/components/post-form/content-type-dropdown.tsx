import {
  AlertTriangle,
  Code,
  Heading2,
  Image,
  PlusCircle,
  Images,
} from "lucide-react";
import { ContentBlockType } from "shared/types/posts.types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentTypeDropdownProps {
  onAddBlock: (type: ContentBlockType) => void;
}

export const ContentTypeDropdown = ({
  onAddBlock,
}: ContentTypeDropdownProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="rounded-full shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="mb-2"
        >
          <DropdownMenuItem onClick={() => onAddBlock("paragraph")}>
            <span className="flex items-center">
              <Heading2 className="w-4 h-4 mr-2" /> Paragraph
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("heading")}>
            <span className="flex items-center">
              <Heading2 className="w-4 h-4 mr-2" /> Heading
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("code")}>
            <span className="flex items-center">
              <Code className="w-4 h-4 mr-2" /> Code Block
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("image")}>
            <span className="flex items-center">
              <Image className="w-4 h-4 mr-2" /> Image
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("alert")}>
            <span className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> Alert
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddBlock("image-carousel")}>
            <span className="flex items-center">
              <Images className="w-4 h-4 mr-2" /> Image Carousel
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
