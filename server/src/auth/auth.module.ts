import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClerkService } from './providers/clerk.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ClerkService],
  exports: [ClerkService],
})
export class AuthModule {}
