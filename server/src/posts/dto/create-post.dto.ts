import {
  IsString,
  IsArray,
  IsNotEmpty,
  MinLength,
  IsEnum,
  MaxLength,
  IsIn,
  IsOptional,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  POST_STATUS,
  POST_TITLE_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
  POST_SUBTITLE_MAX_LENGTH,
  CONTENT_BLOCK_MIN_LENGTH,
  CONTENT_BLOCK_MAX_LENGTH,
  CONTENT_BLOCK_TYPE,
  CONTENT_BLOCK_TYPE_META_ALERT_TYPE,
} from '../../../../shared/constants/posts.constants';
import { tagsAsStrings } from '../../../../shared/constants/tags.constants';
import {
  ContentBlockType,
  ContentBlockTypeMetaAlertType,
  PostStatus,
} from '../../../../shared/types/posts.types';
import { Tag } from '../../../../shared/types/tags.types';

// DTO for content block meta information
class ContentBlockMetaDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @IsIn(CONTENT_BLOCK_TYPE_META_ALERT_TYPE)
  alertType?: ContentBlockTypeMetaAlertType;
}

// DTO for content blocks
class ContentBlockDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsIn(CONTENT_BLOCK_TYPE)
  type: ContentBlockType;

  @IsString()
  @MinLength(CONTENT_BLOCK_MIN_LENGTH)
  @MaxLength(CONTENT_BLOCK_MAX_LENGTH)
  content: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContentBlockMetaDto)
  meta?: ContentBlockMetaDto;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(POST_TITLE_MIN_LENGTH)
  @MaxLength(POST_TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(POST_SUBTITLE_MAX_LENGTH)
  subtitle?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks: ContentBlockDto[];

  @IsArray()
  @IsIn(tagsAsStrings, { each: true })
  tags: Tag[];

  @IsEnum(POST_STATUS)
  status: PostStatus;
}
