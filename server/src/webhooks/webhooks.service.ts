import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Process webhook events from Clerk
   * @param eventType The type of event
   * @param data The event data
   */
  async processWebhookEvent(eventType: string, data: any): Promise<void> {
    // Ensure data is defined
    if (!data) {
      this.logger.error('Webhook data is undefined');
      throw new Error('Webhook data is undefined');
    }

    switch (eventType) {
      case 'user.created':
        await this.handleUserCreated(data);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(data);
        break;
      case 'user.updated':
        await this.handleUserUpdated(data);
        break;
      default:
        this.logger.log(`Unhandled webhook event type: ${eventType}`);
    }
  }

  private async handleUserCreated(data: any): Promise<void> {
    // The correct structure might be just data.id instead of data.data.id
    const clerkId = data.id || (data.data && data.data.id);

    if (!clerkId) {
      this.logger.error('Cannot find user ID in webhook data');
      throw new Error('Missing user ID in webhook data');
    }

    this.logger.log(`Creating user from webhook: ${clerkId}`);

    // Extract user data safely, making sure to check if each property exists
    const userData = data.data || data;

    // Extract email safely
    const emailAddresses = userData.email_addresses || [];
    const emailAddress =
      emailAddresses.length > 0 ? emailAddresses[0].email_address : null;

    if (!emailAddress) {
      this.logger.warn(
        `No email found for user ${clerkId}. Using a placeholder.`,
      );
    }

    // Check for OAuth refresh token issues but reduce logging
    let hasOAuthRefreshTokenIssue = false;
    let oauthProvider = null;

    const externalAccounts = userData.external_accounts || [];
    for (const account of externalAccounts) {
      if (
        account.verification?.error?.code ===
        'external_account_missing_refresh_token'
      ) {
        hasOAuthRefreshTokenIssue = true;
        oauthProvider = account.provider;
        // Keep this one warning about missing refresh tokens
        this.logger.warn(
          `User ${clerkId} is missing a refresh token for ${oauthProvider}`,
        );
      }
    }

    // Create user in our database

    try {
      await this.usersService.create({
        clerkId: clerkId,
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: emailAddress || `${clerkId}@placeholder.com`, // Use a placeholder email if none provided
        username: userData.username || emailAddress?.split('@')[0],
        profileImageUrl: userData.profile_image_url || null,
      });

      // Keep a simple confirmation log
      this.logger.log(`User created: ${clerkId}`);

      // Only log OAuth issue if needed
      if (hasOAuthRefreshTokenIssue) {
        this.logger.warn(
          `Note: User ${clerkId} may need to reconnect their ${oauthProvider} account`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error; // Re-throw to be caught by the controller
    }
  }

  private async handleUserDeleted(data: any): Promise<void> {
    const userId = data.id || (data.data && data.data.id);
    this.logger.log(`Deleting user from webhook: ${userId}`);
    // Pass true to skipClerkDeletion since this is triggered by Clerk webhook
    await this.usersService.removeByClerkId(userId, true);
    this.logger.log(`User deleted: ${userId}`);
  }

  private async handleUserUpdated(data: any): Promise<void> {
    const userId = data.id || (data.data && data.data.id);
    this.logger.log(`Updating user from webhook: ${userId}`);
    await this.usersService.updateByClerkId(userId, data.data);
    this.logger.log(`User updated: ${userId}`);
  }
}
