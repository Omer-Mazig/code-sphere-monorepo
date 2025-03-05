import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  UnauthorizedException,
  RawBodyRequest,
  Req,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name);

  constructor(private configService: ConfigService) {}

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
      this.logger.error('Error parsing webhook payload:', error);
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
      this.logger.error('Invalid webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.log(`Received Clerk webhook event: ${payload.type}`);

    // We're just logging the events now since we're directly using Clerk for user data
    switch (payload.type) {
      case 'user.created':
        this.logger.log(`New user created in Clerk: ${payload.data.id}`);
        break;
      case 'user.updated':
        this.logger.log(`User updated in Clerk: ${payload.data.id}`);
        break;
      case 'user.deleted':
        this.logger.log(`User deleted from Clerk: ${payload.data.id}`);
        break;
      default:
        this.logger.log(`Unhandled event type: ${payload.type}`);
    }

    return { received: true, event: payload.type };
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
          this.logger.warn(
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
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}
