// React and hooks
import { useState } from "react";
import { useForm } from "react-hook-form";

// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Local UI components
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { BlockTypeButtons } from "./block-type-buttons";
import { FormFields } from "./form-fields";
import { SortableContentBlock } from "./sortable-content-block";

// Types and schemas
import { CreatePostInput, createPostSchema } from "../../schemas/post.schema";
import { POST_STATUS } from "../../../../../../shared/constants/posts.constants";
import {
  ContentBlock,
  ContentBlockType,
} from "../../../../../../shared/types/posts.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface PostFormProps {
  defaultValues?: Partial<Omit<CreatePostInput, "contentBlocks">> & {
    contentBlocks?: ContentBlock[];
  };
  onSubmit: (values: CreatePostInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export const PostForm = ({
  onSubmit,
  onCancel,
  submitLabel = "Create Post",
  isLoading = false,
  defaultValues,
}: PostFormProps) => {
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

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setContentBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
        form.setValue("contentBlocks", reorderedBlocks);
        return reorderedBlocks;
      });
    }
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <Card className="xl:col-span-8">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormFields control={form.control} />
            </CardContent>
          </Card>

          <Card className="xl:col-span-4">
            <CardHeader>
              <CardTitle>Select Content Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BlockTypeButtons onAddBlock={addContentBlock} />
            </CardContent>
          </Card>
        </div>

        <>
          <Card>
            <CardHeader>
              <CardTitle>Edit Content</CardTitle>
            </CardHeader>
            <CardContent>
              {contentBlocks.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={contentBlocks.map((block) => block.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {contentBlocks.map((block) => (
                      <SortableContentBlock
                        key={block.id}
                        block={block}
                        onChange={(updatedBlock) =>
                          updateContentBlock(block.id, updatedBlock)
                        }
                        onRemove={() => removeContentBlock(block.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                <p className="text-center text-sm text-muted-foreground h-48 flex items-center justify-center">
                  No content blocks yet
                </p>
              )}
            </CardContent>
          </Card>
        </>

        <Card className="flex justify-end space-x-4 mb-8">
          <CardContent>
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
