import { Input } from "@/components/ui/input";
import { ContentBlock } from "shared/types/posts.types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ImageBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const ImageBlockEditor = ({
  block,
  onChange,
}: ImageBlockEditorProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const imageUrls = block.meta?.imageUrls || [];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      const updatedUrls = [...imageUrls, newImageUrl.trim()];
      onChange({
        ...block,
        meta: {
          ...block.meta,
          imageUrls: updatedUrls,
        },
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    onChange({
      ...block,
      meta: {
        ...block.meta,
        imageUrls: updatedUrls,
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Image URL..."
        />
        <Button
          type="button"
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {imageUrls.length > 0 && (
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <Input
                value={url}
                disabled
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Input
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        placeholder="Image caption..."
        className="mt-3"
      />
    </>
  );
};
