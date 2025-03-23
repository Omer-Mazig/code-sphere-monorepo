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

      {/* Different editor UI based on block type */}
      {block.type === "paragraph" && (
        <ParagraphBlockEditor
          block={block}
          onChange={onChange}
        />
      )}

      {block.type === "heading" && (
        <HeadingBlockEditor
          block={block}
          onChange={onChange}
        />
      )}

      {block.type === "code" && (
        <CodeBlockEditor
          block={block}
          onChange={onChange}
        />
      )}

      {block.type === "image" && (
        <ImageBlockEditor
          block={block}
          onChange={onChange}
        />
      )}

      {block.type === "alert" && (
        <AlertBlockEditor
          block={block}
          onChange={onChange}
        />
      )}
    </div>
  );
};
