import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ContentBlock } from "shared/types/posts.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostPreviewDialogProps {
  title: string;
  subtitle?: string;
  contentBlocks: ContentBlock[];
  tags: string[];
  trigger?: ReactNode;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClassName?: string;
}

export const PostPreviewDialog = ({
  title,
  subtitle,
  contentBlocks,
  tags,
  trigger,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonClassName = "gap-2",
}: PostPreviewDialogProps) => {
  const defaultTrigger = (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={buttonClassName}
    >
      <Eye className="h-4 w-4" />
      Preview
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="!max-w-[90vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {contentBlocks.map((block) => (
                  <RenderContentBlock
                    key={block.id}
                    block={block}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RenderContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "heading":
      return <h2 className="text-2xl font-bold">{block.content}</h2>;
    case "paragraph":
      return <p className="text-base">{block.content}</p>;
    case "code":
      return (
        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
          <code>{block.content}</code>
        </pre>
      );
    case "image":
      return block.meta?.imageUrl ? (
        <div className="my-4">
          <img
            src={block.meta.imageUrl}
            alt={block.content || "Post image"}
            className="rounded-md max-w-full mx-auto"
          />
          {block.content && (
            <p className="text-sm text-center text-muted-foreground mt-2">
              {block.content}
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground italic">[Image placeholder]</p>
      );
    case "alert":
      const alertType = block.meta?.alertType || "info";
      const alertClasses = {
        info: "bg-blue-50 text-blue-800 border-blue-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        error: "bg-red-50 text-red-800 border-red-200",
      };

      return (
        <div
          className={`${alertClasses[alertType as keyof typeof alertClasses]} p-4 rounded-md border`}
        >
          {block.content}
        </div>
      );
    case "image-carousel":
      return block.meta?.imageUrls && block.meta.imageUrls.length > 0 ? (
        <div className="my-4">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {block.meta.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Carousel image ${index + 1}`}
                className="rounded-md h-40 w-auto object-cover"
              />
            ))}
          </div>
          {block.content && (
            <p className="text-sm text-center text-muted-foreground mt-2">
              {block.content}
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground italic">
          [Image carousel placeholder]
        </p>
      );
    default:
      return <p>{block.content}</p>;
  }
};
