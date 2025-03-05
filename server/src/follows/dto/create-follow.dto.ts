import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  @IsString()
  followingClerkId: string; // The ID of the user to follow
}
