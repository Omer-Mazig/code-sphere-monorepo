import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock } from "shared/types/posts.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AlertBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const AlertBlockEditor = ({
  block,
  onChange,
}: AlertBlockEditorProps) => {
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
      <div className="flex flex-col gap-3 mb-3">
        <Input
          value={block.meta?.title || ""}
          onChange={(e) => updateMeta("title", e.target.value)}
          placeholder="Alert title (optional)..."
          className="font-medium"
        />
        <Select
          value={block.meta?.alertType || "info"}
          onValueChange={(value) =>
            updateMeta("alertType", value as "info" | "warning" | "error")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Alert type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Alert content..."
        className="min-h-[100px]"
      />
    </>
  );
};
