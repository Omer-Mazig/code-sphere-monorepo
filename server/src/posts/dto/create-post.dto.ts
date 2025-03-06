import { IsString, IsArray, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsArray()
  tags: string[];
}
