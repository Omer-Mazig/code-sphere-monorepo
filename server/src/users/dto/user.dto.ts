import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * DTO for returning user data in API responses
 */
@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'User identifier (Clerk ID)',
    example: 'user_2NxVCBRGYDoHqbW7qGcTCrKhcM1',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/images/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;

  @Expose()
  @ApiProperty({
    description: 'Date user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * DTO for user update operations
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/images/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;
}

/**
 * DTO for follower/following relationship responses
 */
@Exclude()
export class FollowRelationshipDto {
  @Expose()
  @ApiProperty({
    description: 'User identifier (Clerk ID)',
    example: 'user_2NxVCBRGYDoHqbW7qGcTCrKhcM1',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/images/profile.jpg',
    required: false,
  })
  profileImageUrl?: string;

  constructor(partial: Partial<FollowRelationshipDto>) {
    Object.assign(this, partial);
  }
}
