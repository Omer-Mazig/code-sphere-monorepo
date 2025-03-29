import { Module, forwardRef } from '@nestjs/common';
import { ClerkService } from './providers/clerk.service';

@Module({
  providers: [ClerkService],
  exports: [ClerkService],
})
export class AuthModule {}
