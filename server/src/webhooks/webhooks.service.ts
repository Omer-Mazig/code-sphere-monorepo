import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

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
        this.logger.warn(`Unhandled webhook event type: ${eventType}`);
    }
  }

  private async handleUserCreated(data: any): Promise<void> {
    this.logger.log(`User created: ${data.id}`);
    console.log('User created:', data);
    // Implement your logic here
    // Example: Create a user profile in your database
  }

  private async handleUserUpdated(data: any): Promise<void> {
    this.logger.log(`User updated: ${data.id}`);
    console.log('User updated:', data);
    // Implement your logic here
    // Example: Update user information in your database
  }

  private async handleUserDeleted(data: any): Promise<void> {
    this.logger.log(`User deleted: ${data.id}`);
    console.log('User deleted:', data);
    // Implement your logic here
    // Example: Delete or deactivate user in your database
  }

  private async handleSessionCreated(data: any): Promise<void> {
    this.logger.log(`Session created: ${data.id}`);
    console.log('Session created:', data);
    // Implement your logic here
    // Example: Log user session in analytics
  }

  private async handleSessionEnded(data: any): Promise<void> {
    this.logger.log(`Session ended: ${data.id}`);
    console.log('Session ended:', data);
    // Implement your logic here
    // Example: Update user's last activity timestamp
  }
}
