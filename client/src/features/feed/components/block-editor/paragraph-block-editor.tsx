import { ContentBlock } from "shared/types/posts.types";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ParagraphBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const ParagraphBlockEditor = ({
  block,
  onChange,
}: ParagraphBlockEditorProps) => (
  <RichTextEditor
    content={block.content}
    onChange={(content) => onChange({ ...block, content })}
    placeholder="Write your paragraph here..."
  />
);
