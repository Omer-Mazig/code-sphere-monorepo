import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    clerkId: string;
    isAdmin: boolean;
    // Add any other user properties you need
  };
}
