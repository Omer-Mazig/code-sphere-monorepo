import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Code,
  Heading2,
  Image,
  Images,
  Loader2,
  LucideIcon,
  TextIcon,
} from "lucide-react";
import { ContentBlockType } from "../../../../../../shared/types/posts.types";

interface IconButtonProps {
  icon: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
}

const IconButton = ({ icon: Icon, children, onClick }: IconButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    className="flex flex-col h-auto py-2 px-3"
  >
    <Icon className="h-4 w-4 mb-1" />
    <span className="text-xs">{children}</span>
  </Button>
);

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
        <div className="grid grid-cols-2 gap-2">
          <IconButton
            icon={TextIcon}
            onClick={() => addContentBlock("paragraph")}
          >
            Paragraph
          </IconButton>

          <IconButton
            icon={Heading2}
            onClick={() => addContentBlock("heading")}
          >
            Heading
          </IconButton>

          <IconButton
            icon={Code}
            onClick={() => addContentBlock("code")}
          >
            Code
          </IconButton>

          <IconButton
            icon={Image}
            onClick={() => addContentBlock("image")}
          >
            Image
          </IconButton>

          <IconButton
            icon={AlertTriangle}
            onClick={() => addContentBlock("alert")}
          >
            Alert
          </IconButton>

          <IconButton
            icon={Images}
            onClick={() => addContentBlock("image-carousel")}
          >
            Carousel
          </IconButton>
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
