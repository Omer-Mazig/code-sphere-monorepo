import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PostSortType } from '../types/post-sort.type';

export class FindPostsDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
