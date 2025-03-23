import { Input } from "@/components/ui/input";
import { ContentBlock } from "../../../../../../shared/types/posts.types";

interface ImageBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const ImageBlockEditor = ({
  block,
  onChange,
}: ImageBlockEditorProps) => {
  const updateMeta = (key: string, value: string) => {
    onChange({
      ...block,
      meta: {
        ...block.meta,
        [key]: value,
      },
    });
  };

  return (
    <>
      <Input
        value={block.meta?.imageUrl || ""}
        onChange={(e) => updateMeta("imageUrl", e.target.value)}
        placeholder="Image URL..."
        className="mb-3"
      />
      <Input
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Image caption..."
      />
    </>
  );
};
