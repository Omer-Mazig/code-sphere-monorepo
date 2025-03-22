import {
  IsString,
  IsArray,
  IsNotEmpty,
  MinLength,
  IsEnum,
  MaxLength,
} from 'class-validator';
import {
  POST_STATUS,
  POST_TITLE_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
  POST_CONTENT_MIN_LENGTH,
  PostStatus,
} from '../../../../shared/constants/posts.constants';
import { Tag } from '../../../../shared/constants/tags.constants';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(POST_TITLE_MIN_LENGTH)
  @MaxLength(POST_TITLE_MAX_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(POST_CONTENT_MIN_LENGTH)
  @MaxLength(POST_CONTENT_MAX_LENGTH)
  content: string;

  @IsArray()
  tags: Tag[];

  @IsEnum(POST_STATUS)
  status: PostStatus;
}
