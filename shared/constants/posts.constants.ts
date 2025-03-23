export const POST_CONTENT_MIN_LENGTH = 2;
export const POST_CONTENT_MAX_LENGTH = 1000;
export const POST_TITLE_MIN_LENGTH = 2;
export const POST_TITLE_MAX_LENGTH = 100;
export const POST_SUBTITLE_MAX_LENGTH = 200;
export const CONTENT_BLOCK_MIN_LENGTH = 2;
export const CONTENT_BLOCK_MAX_LENGTH = 5000;

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const CONTENT_BLOCK_TYPE_META_ALERT_TYPE = [
  "info",
  "warning",
  "error",
] as const;

// Content block types
export const CONTENT_BLOCK_TYPE = [
  "paragraph",
  "heading",
  "code",
  "image",
  "alert",
  "image-carousel",
] as const;
