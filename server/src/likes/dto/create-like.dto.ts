import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsOptional()
  @IsUUID()
  commentId?: string;
}
