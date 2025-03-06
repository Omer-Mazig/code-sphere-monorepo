import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RequestWithUser } from './request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('public')
  getPublicData() {
    return {
      message: 'This endpoint is public and does not require authentication',
    };
  }

  @Get('protected')
  getProtectedData(@Req() req: RequestWithUser) {
    return {
      message: 'This endpoint is protected and requires authentication',
      user: req.user,
    };
  }
}
