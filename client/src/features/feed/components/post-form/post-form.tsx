// React and hooks
import { useState } from "react";
import { useForm } from "react-hook-form";

// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form } from "@/components/ui/form";
import { FormFields } from "./form-fields";
import { SortableContentBlock } from "./sortable-content-block";
import { ContentTypeDropdown } from "./content-type-dropdown";

// Types and schemas
import { CreatePostInput, createPostSchema } from "../../schemas/post.schema";
import { POST_STATUS } from "../../../../../../shared/constants/posts.constants";
import {
  ContentBlock,
  ContentBlockType,
} from "../../../../../../shared/types/posts.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
    mode: "onSubmit",
  });

  // Access form errors and submission state
  const { errors, isSubmitted } = form.formState;

  // Function to validate and mark empty blocks
  const validateAndMarkEmptyBlocks = () => {
    let hasEmptyBlocks = false;

    // Clear any previous content block errors
    form.clearErrors("contentBlocks");

    // Find blocks with empty content
    contentBlocks.forEach((block, index) => {
      if (!block.content.trim()) {
        // Set errors for individual content blocks
        form.setError(`contentBlocks.${index}.content`, {
          type: "manual",
          message: "Content cannot be empty",
        });
        hasEmptyBlocks = true;
      }
    });

    return hasEmptyBlocks;
  };

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

    // Clear any contentBlocks errors since we now have at least one block
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
    // Remove the check that prevents removing the last block
    const updatedBlocks = contentBlocks.filter((block) => block.id !== id);
    setContentBlocks(updatedBlocks);
    form.setValue("contentBlocks", updatedBlocks);

    // Only clear errors if there are already errors and the user adds content blocks back
    if (form.formState.errors.contentBlocks && updatedBlocks.length > 0) {
      form.clearErrors("contentBlocks");
    }
  };

  const duplicateContentBlock = (id: string) => {
    const blockToDuplicate = contentBlocks.find((block) => block.id === id);

    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: uuidv4(), // Generate a new ID for the duplicate
      };

      // Find the index of the block to duplicate
      const blockIndex = contentBlocks.findIndex((block) => block.id === id);

      // Insert the duplicated block after the original
      const updatedBlocks = [
        ...contentBlocks.slice(0, blockIndex + 1),
        duplicatedBlock,
        ...contentBlocks.slice(blockIndex + 1),
      ];

      setContentBlocks(updatedBlocks);
      form.setValue("contentBlocks", updatedBlocks);

      // Clear any contentBlocks errors
      form.clearErrors("contentBlocks");
    }
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
    try {
      // Check for empty content blocks
      if (contentBlocks.length === 0) {
        form.setError("contentBlocks", {
          type: "manual",
          message: "Post must have at least one content block",
        });
        return; // Prevent submission
      }

      // Check for empty content in blocks and mark them
      const hasEmptyBlocks = validateAndMarkEmptyBlocks();
      if (hasEmptyBlocks) {
        form.setError("contentBlocks", {
          type: "manual",
          message: "All content blocks must have content",
        });
        return; // Prevent submission
      }

      // Make sure contentBlocks are included in the submission
      const formData = {
        ...values,
        contentBlocks: contentBlocks,
      };

      onSubmit(formData);
    } catch (error) {
      // Handle any other validation errors
      toast.error("Something went wrong.");
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <Separator />
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
                    showErrors={isSubmitted}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center h-48 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No content blocks yet
            </p>
            {isSubmitted && errors.contentBlocks && (
              <p className="text-sm text-destructive mt-2">
                {errors.contentBlocks.message}
              </p>
            )}
          </div>
        )}
      </form>
      <ContentTypeDropdown onAddBlock={addContentBlock} />
    </Form>
  );
};
