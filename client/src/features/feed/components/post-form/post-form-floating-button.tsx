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
  Eye,
  Heading2,
  Image,
  LucideIcon,
  TextIcon,
  X,
} from "lucide-react";
import { ContentBlockType } from "shared/types/posts.types";
import { PostPreviewDialog } from "./post-preview-dialog";

interface IconDropdownMenuItemProps {
  icon: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const IconDropdownMenuItem = ({
  icon: Icon,
  children,
  onClick,
  disabled,
}: IconDropdownMenuItemProps) => (
  <DropdownMenuItem
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="mr-2 h-4 w-4" />
    <span>{children}</span>
  </DropdownMenuItem>
);

interface PostFormFloatingButtonProps {
  onClearEmptyBlocks: () => void;
  onAddContentBlock: (type: ContentBlockType) => void;
  onCancel: () => void;
  onSubmit: () => void;

  submitLabel: string;
  formData: {
    title: string;
    subtitle?: string;
    contentBlocks: any[];
    tags: string[];
  };
}

export const PostFormFloatingButton = ({
  onClearEmptyBlocks,
  onAddContentBlock,
  onCancel,
  onSubmit,

  submitLabel,
  formData,
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
          <IconDropdownMenuItem
            icon={TextIcon}
            onClick={() => onAddContentBlock("paragraph")}
          >
            Paragraph
          </IconDropdownMenuItem>
          <IconDropdownMenuItem
            icon={Heading2}
            onClick={() => onAddContentBlock("heading")}
          >
            Heading
          </IconDropdownMenuItem>
          <IconDropdownMenuItem
            icon={Code}
            onClick={() => onAddContentBlock("code")}
          >
            Code Block
          </IconDropdownMenuItem>
          <IconDropdownMenuItem
            icon={Image}
            onClick={() => onAddContentBlock("image")}
          >
            Image
          </IconDropdownMenuItem>
          <IconDropdownMenuItem
            icon={AlertTriangle}
            onClick={() => onAddContentBlock("alert")}
          >
            Alert
          </IconDropdownMenuItem>

          <DropdownMenuSeparator />

          <IconDropdownMenuItem
            icon={X}
            onClick={onClearEmptyBlocks}
          >
            Clear empty blocks
          </IconDropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <PostPreviewDialog
          title={formData.title}
          subtitle={formData.subtitle}
          contentBlocks={formData.contentBlocks}
          tags={formData.tags}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Post
            </DropdownMenuItem>
          }
        />
        <DropdownMenuItem onClick={onSubmit}>{submitLabel}</DropdownMenuItem>
        <DropdownMenuItem onClick={onCancel}>Cancel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
