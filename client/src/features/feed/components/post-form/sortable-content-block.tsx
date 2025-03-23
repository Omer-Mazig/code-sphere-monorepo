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
import { useEffect, useState, useRef } from "react";

interface SortableContentBlockProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
  onRemove: () => void;
  onDuplicate: (id: string) => void;
  error?: string;
  showErrors?: boolean;
  autoFocus?: boolean;
}

export const SortableContentBlock = ({
  block,
  onChange,
  onRemove,
  onDuplicate,
  error,
  showErrors = false,
  autoFocus = false,
}: SortableContentBlockProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const editorRef = useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  // Force open the accordion when there's an error or autoFocus is true
  useEffect(() => {
    if ((showErrors && error) || autoFocus) {
      setOpenItem(block.id);
    }
  }, [showErrors, error, block.id, autoFocus]);

  // Focus the text input when autoFocus is true and accordion is open
  useEffect(() => {
    if (autoFocus && openItem === block.id) {
      // Delay to ensure the accordion content and editor are fully rendered
      const timer = setTimeout(() => {
        if (editorRef.current) {
          // Try different selectors in priority order for different block types
          const selectors = [
            // Rich text editor elements
            ".ProseMirror",

            // Regular inputs (used by many block types)
            "textarea",
            'input[type="text"]',
            'input[type="url"]',

            // Fallbacks for any other input types
            'input:not([type="hidden"])',
            "select",

            // Final fallback - any focusable element
            "button:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ];

          // Try each selector in order until we find an element to focus
          for (const selector of selectors) {
            const element = editorRef.current.querySelector(
              selector
            ) as HTMLElement;
            if (element) {
              element.focus();
              return;
            }
          }
        }
      }, 50); // Delay to ensure all components are fully rendered

      return () => clearTimeout(timer);
    }
  }, [autoFocus, openItem, block.id]);

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
            value={openItem}
            onValueChange={setOpenItem}
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
                  <div ref={editorRef}>
                    <ContentBlockEditor
                      block={block}
                      onChange={onChange}
                      onRemove={onRemove}
                      error={error}
                      showErrors={showErrors}
                      hideHeader={true}
                    />
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  );
};
