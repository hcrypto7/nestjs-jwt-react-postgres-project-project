import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAuthenticationGuard extends AuthGuard('jwt') {}

export default JwtAuthenticationGuard;
