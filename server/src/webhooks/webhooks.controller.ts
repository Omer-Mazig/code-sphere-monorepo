import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  UnprocessableEntityException,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Webhook } from 'svix';
import { Request, Response } from 'express';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
      throw new UnprocessableEntityException(
        'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env',
      );
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headers = req.headers;

    // Get Svix headers for verification
    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      this.logger.error('Missing svix headers');
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Error: Missing svix headers',
      });
    }

    // Check if raw body is available
    if (!req.rawBody) {
      this.logger.error('Raw body is missing from request');
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Error: Raw body is missing from request',
      });
    }

    let evt;
    const payload = req.rawBody;

    // Attempt to verify the incoming webhook
    try {
      evt = wh.verify(payload.toString(), {
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string,
      });
    } catch (err) {
      this.logger.error(`Could not verify webhook: ${err.message}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }

    // Process the webhook event
    const { id } = evt.data;
    const eventType = evt.type;
    this.logger.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );

    // Process the event using the webhooks service
    try {
      await this.webhooksService.processWebhookEvent(eventType, evt.data);
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error processing webhook',
      });
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Webhook received and processed',
    });
  }
}
