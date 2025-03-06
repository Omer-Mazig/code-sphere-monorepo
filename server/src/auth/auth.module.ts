import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClerkModule } from '../clerk/clerk.module';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule, ClerkModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Register ClerkAuthGuard as a global guard
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
