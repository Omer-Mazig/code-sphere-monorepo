import { AlertTitle } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";
import { Alert } from "@/components/ui/alert";
import { ContentBlock } from "shared/types/posts.types";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CopyIcon,
  Info,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { useTheme } from "@/providers/theme-provider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeadingBlock = ({ content }: { content: string }) => {
  return <h2 className="text-2xl font-bold my-2">{content}</h2>;
};

const ParagraphBlock = ({ content }: { content: string }) => {
  const { isDarkMode } = useTheme();

  // TODO: consider not using dangerouslySetInnerHTML and use a library like react-html-parser
  return (
    <div
      className={cn("prose max-w-none mb-6", isDarkMode ? "prose-invert" : "")}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const CodeBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { title?: string; language?: string };
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="relative">
      {meta?.title && (
        <div className="text-sm text-muted-foreground mb-1">{meta.title}</div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground text-sm cursor-pointer flex items-center gap-2"
      >
        <CopyIcon className="w-4 h-4" />
        <span>Copy</span>
      </button>
      <SyntaxHighlighter
        language={meta?.language || "javascript"}
        style={vscDarkPlus}
        className="rounded-md"
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const ImageBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { imageUrl?: string };
}) => {
  return (
    <figure>
      <img
        src={meta?.imageUrl}
        alt={content}
        className="rounded-md max-w-full mx-auto"
      />
      {content && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {content}
        </figcaption>
      )}
    </figure>
  );
};

const ImageCarouselBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { imageUrls?: string[] };
}) => {
  const imageUrls = meta?.imageUrls || [];

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="my-6 px-12">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={url}
                  alt={content || `Image ${index + 1}`}
                  className="rounded-md w-full h-auto max-h-[600px] object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="lg:-left-12" />
        <CarouselNext className="lg:-right-12" />
      </Carousel>
      {content && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          {content}
        </figcaption>
      )}
    </div>
  );
};

const AlertBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { alertType?: "info" | "warning" | "error"; title?: string };
}) => {
  let AlertIcon: LucideIcon | null = null;
  let titleColor: string | null = null;

  switch (meta?.alertType) {
    case "info":
      AlertIcon = Info;
      titleColor = "text-blue-500";
      break;
    case "warning":
      AlertIcon = AlertCircle;
      titleColor = "text-yellow-500";
      break;
    case "error":
      AlertIcon = AlertTriangle;
      titleColor = "text-red-500";
      break;
  }

  return (
    <Alert
      className="p-6"
      variant={meta?.alertType}
    >
      {meta?.title && (
        <AlertTitle
          className={cn("flex items-center gap-2 text-xl mb-4", titleColor)}
        >
          {" "}
          {AlertIcon && <AlertIcon className="h-6 w-6" />} {meta.title}
        </AlertTitle>
      )}
      <AlertDescription>
        <ReactMarkdown>{content}</ReactMarkdown>
      </AlertDescription>
    </Alert>
  );
};

// TODO: create folder for content block renderers
export const ContentBlockRenderer = ({ block }: { block: ContentBlock }) => {
  const { isDarkMode } = useTheme();

  switch (block.type) {
    case "heading":
      return <HeadingBlock content={block.content} />;

    case "paragraph":
      return (
        <div className="my-2">
          <ParagraphBlock content={block.content} />
        </div>
      );

    case "code":
      return (
        <div className="my-4">
          <CodeBlock
            content={block.content}
            meta={block.meta}
          />
        </div>
      );

    case "image":
      return (
        <div className="my-6">
          <ImageBlock
            content={block.content}
            meta={block.meta}
          />
        </div>
      );

    case "image-carousel":
      return (
        <ImageCarouselBlock
          content={block.content}
          meta={block.meta}
        />
      );

    case "alert":
      return (
        <div className="my-12">
          <AlertBlock
            content={block.content}
            meta={block.meta}
          />
        </div>
      );

    default:
      const _unreachable: never = block.type;
      console.log("Oops, we missed a case", _unreachable);
      return (
        <div
          className={cn(
            "prose max-w-none my-4",
            isDarkMode ? "prose-invert" : ""
          )}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
  }
};
