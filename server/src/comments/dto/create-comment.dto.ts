import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
