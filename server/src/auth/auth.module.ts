import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ClerkModule } from '../clerk/clerk.module';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, ClerkModule, forwardRef(() => UsersModule)],
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
