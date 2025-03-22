export const POST_CONTENT_MAX_LENGTH = 1000;
export const POST_TITLE_MAX_LENGTH = 100;

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
