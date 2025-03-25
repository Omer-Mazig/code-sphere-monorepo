import { useState } from "react";
import { ContentBlock } from "shared/types/posts.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselBlockEditorProps {
  block: ContentBlock;
  onChange: (updatedBlock: ContentBlock) => void;
}

export const ImageCarouselBlockEditor = ({
  block,
  onChange,
}: ImageCarouselBlockEditorProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const imageUrls = block.meta?.imageUrls || [];
  const caption = block.content || "";

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

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...block,
      content: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="caption">Caption (optional)</Label>
        <Input
          id="caption"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Add a caption for this carousel"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!newImageUrl.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {imageUrls.length > 0 && (
        <div className="my-4">
          <Label className="mb-2 block">Preview</Label>
          <Carousel className="w-full max-w-md mx-auto">
            <CarouselContent>
              {imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative p-1">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="rounded-md w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {imageUrls.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground">
            Add image URLs to create a carousel
          </p>
        </div>
      )}
    </div>
  );
};
