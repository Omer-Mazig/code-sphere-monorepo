import {
  CONTENT_BLOCK_TYPE,
  POST_STATUS,
  CONTENT_BLOCK_TYPE_META_ALERT_TYPE,
} from "../constants/posts.constants";

export type ContentBlockTypeMetaAlertType =
  (typeof CONTENT_BLOCK_TYPE_META_ALERT_TYPE)[number];

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPE)[number];

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

// Content block structure
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  meta?: {
    title?: string;
    language?: string;
    imageUrl?: string;
    imageUrls?: string[];
    alertType?: ContentBlockTypeMetaAlertType;
  };
}
