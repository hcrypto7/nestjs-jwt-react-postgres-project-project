import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import AuthenticationService from './authentication.service';

@Injectable()
class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return this.authenticationService.getAuthenticatedUser({ email, password });
  }
}

export default LocalStrategy;
