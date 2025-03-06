import { IsString, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateLikeDto {
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => !o.commentId)
  postId?: string;

  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => !o.postId)
  commentId?: string;
}
