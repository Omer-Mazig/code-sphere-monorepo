import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical } from "lucide-react";
import { ContentBlock } from "../../../../../../shared/types/posts.types";
import { ContentBlockEditor } from "../block-editor/content-block-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SortableContentBlockProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
  onRemove: () => void;
  onDuplicate: (id: string) => void;
  error?: string;
  showErrors?: boolean;
}

export const SortableContentBlock = ({
  block,
  onChange,
  onRemove,
  onDuplicate,
  error,
  showErrors = false,
}: SortableContentBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockTypeLabel =
    block.type.charAt(0).toUpperCase() + block.type.slice(1);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4"
    >
      <Card className={showErrors && error ? "border-destructive" : ""}>
        <div className="flex flex-row items-center">
          <button
            type="button"
            className="p-2 cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <Accordion
            type="single"
            collapsible
            className="flex-1"
            defaultValue={block.id}
          >
            <AccordionItem
              value={block.id}
              className="border-0"
            >
              <div className="flex items-center justify-between pr-2">
                <AccordionTrigger className="py-3 px-2 flex-1 flex flex-row-reverse">
                  {blockTypeLabel} Block
                </AccordionTrigger>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDuplicate(block.id)}>
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onRemove}
                      className="text-destructive"
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AccordionContent>
                <CardContent className="pt-2 px-4">
                  <ContentBlockEditor
                    block={block}
                    onChange={onChange}
                    onRemove={onRemove}
                    error={error}
                    showErrors={showErrors}
                    hideHeader={true}
                  />
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  );
};
