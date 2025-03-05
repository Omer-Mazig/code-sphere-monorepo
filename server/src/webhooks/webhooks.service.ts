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
    this.logger.log(`Processing webhook event: ${eventType}`);

    switch (eventType) {
      case 'user.created':
        await this.handleUserCreated(data);
        break;
      case 'user.updated':
        await this.handleUserUpdated(data);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(data);
        break;
      case 'session.created':
        await this.handleSessionCreated(data);
        break;
      case 'session.ended':
        await this.handleSessionEnded(data);
        break;
      default:
        this.logger.log(`Unhandled webhook event type: ${eventType}`);
    }
  }

  private async handleUserCreated(data: any): Promise<void> {
    this.logger.log(`User created: ${data.data.id}`);

    // Create user in our database
    await this.usersService.create({
      clerkId: data.data.id,
      firstName: data.data.first_name,
      lastName: data.data.last_name,
      email: data.data.email_addresses[0]?.email_address || '',
      username: data.data.username,
      profileImageUrl: data.data.profile_image_url,
    });
  }

  private async handleUserUpdated(data: any): Promise<void> {
    this.logger.log(`User updated: ${data.data.id}`);

    const existingUser = await this.usersService.findByClerkId(data.data.id);

    if (existingUser) {
      await this.usersService.updateByClerkId(data.data.id, {
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        email:
          data.data.email_addresses[0]?.email_address || existingUser.email,
        username: data.data.username,
        profileImageUrl: data.data.profile_image_url,
      });
    }
  }

  private async handleUserDeleted(data: any): Promise<void> {
    this.logger.log(`User deleted: ${data.data.id}`);

    const user = await this.usersService.findByClerkId(data.data.id);

    if (user) {
      // Instead of deleting, mark as inactive
      await this.usersService.updateByClerkId(data.data.id, {
        isActive: false,
      });
    }
  }

  private async handleSessionCreated(data: any): Promise<void> {
    this.logger.log(`Session created for user: ${data.data.user_id}`);
    // Additional logic for session creation if needed
  }

  private async handleSessionEnded(data: any): Promise<void> {
    this.logger.log(`Session ended for user: ${data.data.user_id}`);
    // Additional logic for session ending if needed
  }
}
