// Content block types
export type ContentBlockType =
  | "paragraph"
  | "heading"
  | "code"
  | "image"
  | "alert";

// Content block structure
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  meta?: {
    title?: string;
    language?: string;
    imageUrl?: string;
    alertType?: "info" | "warning" | "error";
  };
}
