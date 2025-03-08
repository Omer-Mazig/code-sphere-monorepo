import { IsOptional, IsString, IsIn } from 'class-validator';
import { PostSortType } from '../types/post-sort.type';

export class FindPostsDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
