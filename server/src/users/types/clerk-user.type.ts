export interface ClerkUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email?: string;
  imageUrl: string | null;
  username: string | null;
}
