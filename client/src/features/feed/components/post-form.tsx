import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Code, Image, AlertTriangle, Heading2 } from "lucide-react";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import {
  ContentBlock,
  ContentBlockType,
} from "../../../../../shared/types/posts.types";
import { useTheme } from "@/providers/theme-provider";
import { ContentBlockEditor } from "./block-editor";

interface PostFormProps {
  defaultValues?: Partial<Omit<CreatePostInput, "contentBlocks">> & {
    contentBlocks?: ContentBlock[];
  };
  onSubmit: (values: CreatePostInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function PostForm({
  onSubmit,
  onCancel,
  submitLabel = "Create Post",
  isLoading = false,
  defaultValues,
}: PostFormProps) {
  const { isDarkMode } = useTheme();

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

  const updateContentBlock = (id: string, updatedBlock: ContentBlock) => {
    const updatedBlocks = contentBlocks.map((block) =>
      block.id === id ? updatedBlock : block
    );
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  const removeContentBlock = (id: string) => {
    const updatedBlocks = contentBlocks.filter((block) => block.id !== id);
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  const handleSubmit = (values: CreatePostInput) => {
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
                    bgColor:
                      "bgColor" in tag
                        ? tag.bgColor
                        : isDarkMode
                          ? "#FFFFFF"
                          : "#000000",
                    textColor:
                      "textColor" in tag
                        ? tag.textColor
                        : isDarkMode
                          ? "#000000"
                          : "#FFFFFF",
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
