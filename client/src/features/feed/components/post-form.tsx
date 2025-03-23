import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreatePostInput, createPostSchema } from "../schemas/post.schema";
import { MultiSelect } from "@/components/ui/multi-select";
import { tags } from "../../../../../shared/constants/tags.constants";
import { POST_STATUS } from "../../../../../shared/constants/posts.constants";
import {
  Loader2,
  Plus,
  X,
  Code,
  Image,
  AlertTriangle,
  Heading2,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

interface PostFormProps {
  defaultValues?: Partial<CreatePostInput>;
  onSubmit: (values: CreatePostInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

// Content block type definitions
type ContentBlockType = "paragraph" | "heading" | "code" | "image" | "alert";

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  meta?: {
    title?: string;
    language?: string;
    imageUrl?: string;
    alertType?: "info" | "warning" | "error";
  };
}

// Helper components for content blocks
const ContentBlockEditor = ({
  block,
  onChange,
  onRemove,
}: {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
  onRemove: () => void;
}) => {
  // Function to update block content
  const updateContent = (content: string) => {
    onChange({ ...block, content });
  };

  // Function to update block meta
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
    <div className="border rounded-md p-4 my-4 relative">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="font-medium">
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
        </div>
      </div>

      {/* Different editor UI based on block type */}
      {block.type === "paragraph" && (
        <Textarea
          value={block.content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Write your paragraph here..."
          className="min-h-[100px]"
        />
      )}

      {block.type === "heading" && (
        <Input
          value={block.content}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Section heading..."
          className="font-bold text-lg"
        />
      )}

      {block.type === "code" && (
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
            onChange={(e) => updateContent(e.target.value)}
            placeholder="// Your code here..."
            className="min-h-[150px] font-mono"
          />
        </>
      )}

      {block.type === "image" && (
        <>
          <Input
            value={block.meta?.imageUrl || ""}
            onChange={(e) => updateMeta("imageUrl", e.target.value)}
            placeholder="Image URL..."
            className="mb-3"
          />
          <Input
            value={block.content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Image caption..."
          />
        </>
      )}

      {block.type === "alert" && (
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
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Alert content..."
            className="min-h-[100px]"
          />
        </>
      )}
    </div>
  );
};

export function PostForm({
  onSubmit,
  onCancel,
  submitLabel = "Create Post",
  isLoading = false,
  defaultValues,
}: PostFormProps) {
  // State for content blocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    defaultValues?.contentBlocks || [
      {
        id: uuidv4(),
        type: "paragraph",
        content: "",
      },
    ]
  );

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      subtitle: defaultValues?.subtitle || "",
      contentBlocks: contentBlocks,
      tags: defaultValues?.tags || [],
      status: defaultValues?.status || POST_STATUS.PUBLISHED,
    },
  });

  // Add a new content block
  const addContentBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type,
      content: "",
      meta: type === "alert" ? { alertType: "info" } : {},
    };

    const updatedBlocks = [...contentBlocks, newBlock];
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  // Update a content block
  const updateContentBlock = (id: string, updatedBlock: ContentBlock) => {
    const updatedBlocks = contentBlocks.map((block) =>
      block.id === id ? updatedBlock : block
    );
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  // Remove a content block
  const removeContentBlock = (id: string) => {
    const updatedBlocks = contentBlocks.filter((block) => block.id !== id);
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  // Handle form submission
  const handleSubmit = (values: any) => {
    // Make sure contentBlocks are included in the submission
    const formData = {
      ...values,
      contentBlocks: contentBlocks,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subtitle">Subtitle</FormLabel>
              <FormControl>
                <Input
                  id="subtitle"
                  placeholder="Enter post subtitle (optional)"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Content</FormLabel>
          <div className="mt-2 space-y-2">
            {contentBlocks.map((block) => (
              <ContentBlockEditor
                key={block.id}
                block={block}
                onChange={(updatedBlock) =>
                  updateContentBlock(block.id, updatedBlock)
                }
                onRemove={() => removeContentBlock(block.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContentBlock("paragraph")}
            >
              <Heading2 className="w-4 h-4 mr-1" /> Add Paragraph
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContentBlock("heading")}
            >
              <Heading2 className="w-4 h-4 mr-1" /> Add Heading
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContentBlock("code")}
            >
              <Code className="w-4 h-4 mr-1" /> Add Code Block
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContentBlock("image")}
            >
              <Image className="w-4 h-4 mr-1" /> Add Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContentBlock("alert")}
            >
              <AlertTriangle className="w-4 h-4 mr-1" /> Add Alert
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tags.map((tag) => ({
                    label: tag.label,
                    value: tag.value,
                  }))}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                  placeholder="Select tags"
                  variant="inverted"
                  maxCount={3}
                  className="h-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
