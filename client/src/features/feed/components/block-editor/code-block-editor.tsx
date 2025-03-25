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

interface CodeBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const CodeBlockEditor = ({ block, onChange }: CodeBlockEditorProps) => {
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
          placeholder="Code snippet title (optional)..."
          className="text-sm"
        />
        <Select
          value={block.meta?.language || "javascript"}
          onValueChange={(value) => updateMeta("language", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="jsx">JSX</SelectItem>
            <SelectItem value="tsx">TSX</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
            <SelectItem value="bash">Bash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="// Your code here..."
        className="min-h-[150px] font-mono"
      />
    </>
  );
};
