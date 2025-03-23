import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Code,
  Heading2,
  Image,
  Images,
  Loader2,
  TextIcon,
} from "lucide-react";
import { ContentBlockType } from "../../../../../../shared/types/posts.types";

interface PostFormFloatingButtonProps {
  addContentBlock: (type: ContentBlockType) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitLabel: string;
}

export const PostFormFloatingButton = ({
  addContentBlock,
  onCancel,
  onSubmit,
  isLoading,
  submitLabel,
}: PostFormFloatingButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <TextIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 lg:hidden"
      >
        <DropdownMenuLabel>Add Content</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => addContentBlock("paragraph")}>
            <TextIcon className="mr-2 h-4 w-4" />
            <span>Paragraph</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addContentBlock("heading")}>
            <Heading2 className="mr-2 h-4 w-4" />
            <span>Heading</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addContentBlock("code")}>
            <Code className="mr-2 h-4 w-4" />
            <span>Code Block</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addContentBlock("image")}>
            <Image className="mr-2 h-4 w-4" />
            <span>Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addContentBlock("alert")}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Alert</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addContentBlock("image-carousel")}>
            <Images className="mr-2 h-4 w-4" />
            <span>Image Carousel</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
