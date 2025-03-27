// React and hooks
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Local UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { FormFields } from "./form-fields";
import { PostFormFloatingButton } from "./post-form-floating-button";
import { PostFormSidebar } from "./post-form-sidebar";
import { SortableContentBlock } from "./sortable-content-block";

// Types and schemas
import { POST_STATUS } from "shared/constants/posts.constants";
import { ContentBlock, ContentBlockType } from "shared/types/posts.types";
import { CreatePostInput, createPostSchema } from "../../schemas/post.schema";

interface PostFormProps {
  defaultValues?: Partial<Omit<CreatePostInput, "contentBlocks">> & {
    contentBlocks?: ContentBlock[];
  };
  onSubmit: (values: CreatePostInput) => void;
  onCancel: () => void;
  submitLabel: string;
}

// TODO: Fix the issue with the delete confirmation dialog (for paragraph blocks)
// TODO: make iamge block and image carousel block a single component and make it to work with the delete confirmation dialog
export const PostForm = ({
  onSubmit,
  onCancel,
  defaultValues,
  submitLabel,
}: PostFormProps) => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    defaultValues?.contentBlocks || []
  );
  const [lastAddedBlockId, setLastAddedBlockId] = useState<string | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (lastAddedBlockId) {
      const timer = setTimeout(() => {
        setLastAddedBlockId(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedBlockId]);

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
    mode: "onSubmit",
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

    setLastAddedBlockId(newBlock.id);

    form.clearErrors("contentBlocks");
  };

  const updateContentBlock = (id: string, updatedBlock: ContentBlock) => {
    const updatedBlocks = contentBlocks.map((block) =>
      block.id === id ? updatedBlock : block
    );
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);
  };

  const removeContentBlock = (id: string) => {
    const blockToRemove = contentBlocks.find((block) => block.id === id);

    if (!blockToRemove?.content.trim()) {
      // If block has no content, remove it directly
      const updatedBlocks = contentBlocks.filter((block) => block.id !== id);
      setContentBlocks(updatedBlocks);
      form.setValue("contentBlocks", updatedBlocks);

      if (form.formState.errors.contentBlocks && updatedBlocks.length > 0) {
        form.clearErrors("contentBlocks");
      }

      toast("Content block removed", {
        action: {
          label: "Undo",
          onClick: () => {
            // TODO: text it Heavily
            setContentBlocks(contentBlocks);
            form.setValue("contentBlocks", contentBlocks);
          },
        },
      });
    } else {
      // If block has content, show confirmation dialog
      setBlockToDelete(id);
    }
  };

  const handleConfirmDelete = () => {
    if (blockToDelete) {
      const updatedBlocks = contentBlocks.filter(
        (block) => block.id !== blockToDelete
      );
      setContentBlocks(updatedBlocks);
      form.setValue("contentBlocks", updatedBlocks);

      if (form.formState.errors.contentBlocks && updatedBlocks.length > 0) {
        form.clearErrors("contentBlocks");
      }

      toast("Content block removed", {
        action: {
          label: "Undo",
          onClick: () => {
            // TODO: text it Heavily
            setContentBlocks(contentBlocks);
            form.setValue("contentBlocks", contentBlocks);
          },
        },
      });

      setBlockToDelete(null);
    }
  };

  const duplicateContentBlock = (id: string) => {
    const blockToDuplicate = contentBlocks.find((block) => block.id === id);

    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: uuidv4(),
      };

      const blockIndex = contentBlocks.findIndex((block) => block.id === id);

      const updatedBlocks = [
        ...contentBlocks.slice(0, blockIndex + 1),
        duplicatedBlock,
        ...contentBlocks.slice(blockIndex + 1),
      ];

      setContentBlocks(updatedBlocks);
      form.setValue("contentBlocks", updatedBlocks);

      setLastAddedBlockId(duplicatedBlock.id);

      form.clearErrors("contentBlocks");
    }
  };

  const clearEmptyBlocks = () => {
    setContentBlocks((prev) => {
      return prev.filter((block) => block.content.trim());
    });
  };

  const validateAndMarkEmptyBlocks = () => {
    let hasEmptyBlocks = false;

    form.clearErrors("contentBlocks");

    contentBlocks.forEach((block, index) => {
      if (!block.content.trim()) {
        form.setError(`contentBlocks.${index}.content`, {
          type: "manual",
          message: "Content cannot be empty",
        });
        hasEmptyBlocks = true;
      }
    });

    return hasEmptyBlocks;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setLastAddedBlockId(null);

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
    try {
      if (contentBlocks.length === 0) {
        form.setError("contentBlocks", {
          type: "manual",
          message: "Post must have at least one content block",
        });
        return;
      }

      const hasEmptyBlocks = validateAndMarkEmptyBlocks();
      if (hasEmptyBlocks) {
        form.setError("contentBlocks", {
          type: "manual",
          message: "All content blocks must have content",
        });
        return;
      }

      onSubmit({
        ...values,
        contentBlocks: contentBlocks,
      });
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormFields control={form.control} />
            </CardContent>
          </Card>

          <Separator />

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
                <div className="space-y-2">
                  {contentBlocks.map((block, index) => (
                    <SortableContentBlock
                      key={block.id}
                      block={block}
                      onChange={(updatedBlock) =>
                        updateContentBlock(block.id, updatedBlock)
                      }
                      onRemove={() => removeContentBlock(block.id)}
                      onDuplicate={duplicateContentBlock}
                      error={
                        form.formState.errors.contentBlocks?.[index]?.content
                          ?.message
                      }
                      showErrors={form.formState.isSubmitted}
                      autoFocus={block.id === lastAddedBlockId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center h-48 flex flex-col items-center justify-center">
              <Card className="w-full h-full">
                <CardContent className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-sm text-muted-foreground">
                    No content blocks yet
                  </p>
                  <Button
                    onClick={() => {
                      addContentBlock("paragraph");
                    }}
                    className="px-16"
                  >
                    Add content block
                  </Button>
                  {form.formState.isSubmitted &&
                    form.formState.errors.contentBlocks && (
                      <p className="text-sm text-destructive mt-2">
                        {form.formState.errors.contentBlocks.message}
                      </p>
                    )}
                </CardContent>
              </Card>
            </div>
          )}
        </form>

        {/* Sidebar for large screens and above */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <PostFormSidebar
              onClearEmptyBlocks={clearEmptyBlocks}
              onAddContentBlock={addContentBlock}
              onCancel={onCancel}
              onSubmit={form.handleSubmit(handleSubmit)}
              submitLabel={submitLabel}
              formData={{
                title: form.watch("title"),
                subtitle: form.watch("subtitle"),
                contentBlocks: contentBlocks,
                tags: form.watch("tags"),
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating button for small screens */}
      <div className="fixed bottom-4 right-4 lg:hidden z-50">
        <PostFormFloatingButton
          onClearEmptyBlocks={clearEmptyBlocks}
          onAddContentBlock={addContentBlock}
          onCancel={onCancel}
          onSubmit={form.handleSubmit(handleSubmit)}
          submitLabel={submitLabel}
          formData={{
            title: form.watch("title"),
            subtitle: form.watch("subtitle"),
            contentBlocks: contentBlocks,
            tags: form.watch("tags"),
          }}
        />
      </div>

      <DeleteConfirmationDialog
        isOpen={!!blockToDelete}
        onOpenChange={(isOpen) => !isOpen && setBlockToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Content Block"
        description="Are you sure you want to remove this content block? This action cannot be undone."
        confirmText="Remove"
      />
    </Form>
  );
};
