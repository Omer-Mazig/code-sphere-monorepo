import { AlertTitle } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";
import { Alert } from "@/components/ui/alert";
import { ContentBlock } from "../../../../../shared/types/posts.types";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Info } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const HeadingBlock = ({ content }: { content: string }) => {
  return <h2 className="text-2xl font-bold my-2">{content}</h2>;
};

const ParagraphBlock = ({ content }: { content: string }) => {
  return <p className="mb-6">{content}</p>;
};

const CodeBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { title?: string; language?: string };
}) => {
  return (
    <>
      {meta?.title && (
        <div className="text-sm text-muted-foreground mb-1">{meta.title}</div>
      )}
      <SyntaxHighlighter
        language={meta?.language || "javascript"}
        style={vscDarkPlus}
        className="rounded-md"
      >
        {content}
      </SyntaxHighlighter>
    </>
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

const AlertBlock = ({
  content,
  meta,
}: {
  content: string;
  meta?: { alertType?: "info" | "warning" | "error"; title?: string };
}) => {
  let AlertIcon: React.ElementType | null = null;
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

export const ContentBlockRenderer = ({ block }: { block: ContentBlock }) => {
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
      return <div className="my-4">{block.content}</div>;
  }
};
