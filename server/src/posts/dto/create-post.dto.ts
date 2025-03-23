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
  PostStatus,
} from '../../../../shared/constants/posts.constants';
import {
  TagAsStrings,
  tagsAsStrings,
} from '../../../../shared/constants/tags.constants';

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
  @IsIn(['info', 'warning', 'error'])
  alertType?: 'info' | 'warning' | 'error';
}

// DTO for content blocks
class ContentBlockDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsIn(['paragraph', 'heading', 'code', 'image', 'alert'])
  type: 'paragraph' | 'heading' | 'code' | 'image' | 'alert';

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
  tags: TagAsStrings[];

  @IsEnum(POST_STATUS)
  status: PostStatus;
}
