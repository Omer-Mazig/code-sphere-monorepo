export const CONTENT_BLOCK_TYPE_META_ALERT_TYPE = [
  "info",
  "warning",
  "error",
] as const;

export type ContentBlockTypeMetaAlertType =
  (typeof CONTENT_BLOCK_TYPE_META_ALERT_TYPE)[number];

// Content block types
export const CONTENT_BLOCK_TYPE = [
  "paragraph",
  "heading",
  "code",
  "image",
  "alert",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPE)[number];

// Content block structure
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  meta?: {
    title?: string;
    language?: string;
    imageUrl?: string;
    alertType?: ContentBlockTypeMetaAlertType;
  };
}
