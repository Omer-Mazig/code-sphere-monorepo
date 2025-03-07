import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when a user cannot be found by their Clerk ID
 */
export class UserNotFoundByClerkIdException extends HttpException {
  constructor(clerkId: string) {
    super(
      {
        message: 'User not found',
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        details: {
          type: 'USER_NOT_FOUND_BY_CLERK_ID',
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Exception thrown when a user cannot be found by their internal ID
 */
export class UserNotFoundByInternalIdException extends HttpException {
  constructor(id: string) {
    super(
      {
        message: 'User not found',
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        details: {
          type: 'USER_NOT_FOUND_BY_INTERNAL_ID',
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Exception thrown when a user attempts to follow themselves
 */
export class SelfFollowException extends HttpException {
  constructor() {
    super(
      {
        message: 'You cannot follow yourself',
        error: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
        details: {
          type: 'SELF_FOLLOW_ATTEMPT',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Exception thrown when a user attempts to perform an action they do not have permission for
 */
export class UserPermissionException extends HttpException {
  constructor(action: string) {
    super(
      {
        message: `You do not have permission to ${action}`,
        error: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
        details: {
          type: 'INSUFFICIENT_USER_PERMISSIONS',
          action,
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
