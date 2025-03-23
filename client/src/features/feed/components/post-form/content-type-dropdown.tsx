import { AlertTriangle, Code, Heading2, Image, PlusCircle } from "lucide-react";
import { ContentBlockType } from "../../../../../../shared/types/posts.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentTypeDropdownProps {
  onAddBlock: (type: ContentBlockType) => void;
}

export const ContentTypeDropdown = ({
  onAddBlock,
}: ContentTypeDropdownProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Select
        onValueChange={(value: ContentBlockType) =>
          onAddBlock(value as ContentBlockType)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select content type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">
            <span className="flex items-center">
              <Heading2 className="w-4 h-4 mr-2" /> Paragraph
            </span>
          </SelectItem>
          <SelectItem value="heading">
            <span className="flex items-center">
              <Heading2 className="w-4 h-4 mr-2" /> Heading
            </span>
          </SelectItem>
          <SelectItem value="code">
            <span className="flex items-center">
              <Code className="w-4 h-4 mr-2" /> Code Block
            </span>
          </SelectItem>
          <SelectItem value="image">
            <span className="flex items-center">
              <Image className="w-4 h-4 mr-2" /> Image
            </span>
          </SelectItem>
          <SelectItem value="alert">
            <span className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" /> Alert
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="sm"
        onClick={() => {
          const selectEl = document.querySelector(
            '[data-slot="select-trigger"]'
          ) as HTMLElement;
          if (selectEl) selectEl.click();
        }}
      >
        <PlusCircle className="w-4 h-4 mr-1" /> Add Block
      </Button>
    </div>
  );
};
