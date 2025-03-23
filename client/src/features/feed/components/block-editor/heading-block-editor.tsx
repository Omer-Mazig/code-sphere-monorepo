import { Input } from "@/components/ui/input";
import { ContentBlock } from "../../../../../../shared/types/posts.types";

interface HeadingBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const HeadingBlockEditor = ({
  block,
  onChange,
}: HeadingBlockEditorProps) => (
  <Input
    value={block.content}
    onChange={(e) => onChange({ ...block, content: e.target.value })}
    placeholder="Section heading..."
    className="font-bold text-lg"
  />
);
