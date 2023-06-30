import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import AuthenticationService from './authentication.service';
import RegisterationDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterationDto) {
    return this.authenticationService.register(registrationData);
  }

  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(200)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const token = this.authenticationService.getJwtToken(user.id);
    const cookieOptions = this.authenticationService.cookieOptions;
    res.cookie('Authorization', token, cookieOptions);

    return user;
  }
}

export default AuthenticationController;
