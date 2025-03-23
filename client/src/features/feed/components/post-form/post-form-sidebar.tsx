import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface PostFormSidebarProps {
  addContentBlock: (type: ContentBlockType) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitLabel: string;
}

export const PostFormSidebar = ({
  addContentBlock,
  onCancel,
  onSubmit,
  isLoading,
  submitLabel,
}: PostFormSidebarProps) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h4 className="text-sm font-medium mb-2">Add Content</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("paragraph")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <TextIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Paragraph</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("heading")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <Heading2 className="h-4 w-4 mb-1" />
            <span className="text-xs">Heading</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("code")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <Code className="h-4 w-4 mb-1" />
            <span className="text-xs">Code</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("image")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <Image className="h-4 w-4 mb-1" />
            <span className="text-xs">Image</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("alert")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <AlertTriangle className="h-4 w-4 mb-1" />
            <span className="text-xs">Alert</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addContentBlock("image-carousel")}
            className="flex flex-col h-auto py-2 px-1"
          >
            <Images className="h-4 w-4 mb-1" />
            <span className="text-xs">Carousel</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
