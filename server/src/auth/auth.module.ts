import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClerkWebhookController } from './webhooks/clerk.controller';
import { UsersModule } from '../users/users.module';
import { ClerkAuthGuard } from './auth.guard';
import * as bodyParser from 'body-parser';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, ClerkAuthGuard],
  controllers: [AuthController, ClerkWebhookController],
  exports: [AuthService, ClerkAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply raw body parser for webhook routes
    consumer
      .apply(bodyParser.raw({ type: 'application/json', limit: '10mb' }))
      .forRoutes('webhooks/clerk');
  }
}
