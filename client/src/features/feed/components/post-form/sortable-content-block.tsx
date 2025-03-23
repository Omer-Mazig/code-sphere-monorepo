import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ContentBlock } from "../../../../../../shared/types/posts.types";
import { ContentBlockEditor } from "../block-editor/content-block-editor";

interface SortableContentBlockProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
  onRemove: () => void;
  error?: string;
  showErrors?: boolean;
}

export const SortableContentBlock = ({
  block,
  onChange,
  onRemove,
  error,
  showErrors = false,
}: SortableContentBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2"
    >
      <button
        type="button"
        className="mt-3 p-1 cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <ContentBlockEditor
          block={block}
          onChange={onChange}
          onRemove={onRemove}
          error={error}
          showErrors={showErrors}
        />
      </div>
    </div>
  );
};
