import { ContentBlock } from "../../../../../../shared/types/posts.types";
import { BlockHeader } from "./block-header";
import { ParagraphBlockEditor } from "./paragraph-block-editor";
import { HeadingBlockEditor } from "./heading-block-editor";
import { CodeBlockEditor } from "./code-block-editor";
import { ImageBlockEditor } from "./image-block-editor";
import { AlertBlockEditor } from "./alert-block-editor";

interface ContentBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
  onRemove: () => void;
}

export const ContentBlockEditor = ({
  block,
  onChange,
  onRemove,
}: ContentBlockEditorProps) => {
  // Function to render the appropriate editor based on block type
  const renderBlockEditor = () => {
    switch (block.type) {
      case "paragraph":
        return (
          <ParagraphBlockEditor
            block={block}
            onChange={onChange}
          />
        );
      case "heading":
        return (
          <HeadingBlockEditor
            block={block}
            onChange={onChange}
          />
        );
      case "code":
        return (
          <CodeBlockEditor
            block={block}
            onChange={onChange}
          />
        );
      case "image":
        return (
          <ImageBlockEditor
            block={block}
            onChange={onChange}
          />
        );
      case "alert":
        return (
          <AlertBlockEditor
            block={block}
            onChange={onChange}
          />
        );
      default:
        const _unreachable: never = block.type;
        console.error(`Unknown block type: ${_unreachable}`);
        return null;
    }
  };

  return (
    <div className="border rounded-md p-4 my-4 relative">
      <BlockHeader
        type={block.type}
        onRemove={onRemove}
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="font-medium">
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
        </div>
      </div>

      {renderBlockEditor()}
    </div>
  );
};
