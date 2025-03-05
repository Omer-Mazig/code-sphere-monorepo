import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Inject,
  forwardRef,
  UnauthorizedException,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post()
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    // Get raw body
    const rawBody = request.rawBody?.toString() || '';

    // Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error('Error parsing webhook payload:', error);
      throw new BadRequestException('Invalid JSON payload');
    }

    // Verify webhook signature
    const isValidSignature = this.verifyWebhookSignature(
      rawBody,
      svixId,
      svixTimestamp,
      svixSignature,
    );

    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    console.log('Received webhook from Clerk:', payload.type);

    // Handle different event types
    switch (payload.type) {
      case 'user.created':
        return this.handleUserCreated(payload.data);

      case 'user.updated':
        return this.handleUserUpdated(payload.data);

      case 'user.deleted':
        return this.handleUserDeleted(payload.data);

      default:
        return { received: true };
    }
  }

  private verifyWebhookSignature(
    payload: string,
    svixId: string,
    svixTimestamp: string,
    svixSignature: string,
  ): boolean {
    try {
      const webhookSecret = this.configService.get<string>(
        'CLERK_WEBHOOK_SECRET',
      );

      // If no webhook secret is configured, don't verify in development mode
      if (!webhookSecret) {
        const nodeEnv = this.configService.get<string>('NODE_ENV');
        if (nodeEnv === 'development') {
          console.warn(
            'No webhook secret configured, skipping verification in development mode',
          );
          return true;
        }
        return false;
      }

      // Split the signature header
      const signatureParts = svixSignature.split(',').map((part) => {
        const [key, value] = part.split('=');
        return { key, value };
      });

      // Get the signature to verify against
      const signature = signatureParts.find((p) => p.key === 'v1')?.value;
      if (!signature) {
        return false;
      }

      // Create the signature base
      const signatureBase = `${svixId}.${svixTimestamp}.${payload}`;

      // Create the expected signature
      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(signatureBase);
      const expectedSignature = hmac.digest('hex');

      // Compare the signatures
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  private async handleUserCreated(userData: any) {
    try {
      console.log('Creating user from webhook:', userData);

      // Check if user already exists
      const existingUser = await this.usersService.findByClerkId(userData.id);

      if (existingUser) {
        console.log(`User ${userData.id} already exists in database`);
        return { success: true, action: 'none' };
      }

      // Create new user
      const primaryEmail = userData.email_addresses?.find(
        (email: any) => email.id === userData.primary_email_address_id,
      )?.email_address;

      if (!primaryEmail) {
        throw new BadRequestException('User has no primary email address');
      }

      const newUser = await this.usersService.create({
        clerkId: userData.id,
        email: primaryEmail,
        firstName: userData.first_name,
        lastName: userData.last_name,
      });

      console.log('Successfully created user in database:', newUser.id);
      return { success: true, action: 'created', userId: newUser.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  private async handleUserUpdated(userData: any) {
    try {
      // Find user by Clerk ID
      const existingUser = await this.usersService.findByClerkId(userData.id);

      if (!existingUser) {
        // User doesn't exist in our database yet, create them
        return this.handleUserCreated(userData);
      }

      // Update user
      const primaryEmail = userData.email_addresses?.find(
        (email: any) => email.id === userData.primary_email_address_id,
      )?.email_address;

      await this.usersService.update(existingUser.id, {
        email: primaryEmail || existingUser.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
      });

      console.log('Successfully updated user in database:', existingUser.id);
      return { success: true, action: 'updated', userId: existingUser.id };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Failed to update user');
    }
  }

  private async handleUserDeleted(userData: any) {
    try {
      // Find user by Clerk ID
      const existingUser = await this.usersService.findByClerkId(userData.id);

      if (!existingUser) {
        console.log(`User ${userData.id} not found in database`);
        return { success: true, action: 'none' };
      }

      // Delete user
      await this.usersService.remove(existingUser.id);

      console.log('Successfully deleted user from database:', existingUser.id);
      return { success: true, action: 'deleted', userId: existingUser.id };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new BadRequestException('Failed to delete user');
    }
  }
}
