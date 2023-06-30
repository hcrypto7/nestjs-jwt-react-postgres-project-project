import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import LoginDto from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';
import UserService from '../users/user.service';
import { User } from '../users/user.entity';
import { RegisterationDto } from './dto/register.dto';
import { CookieOptions } from 'express';

@Injectable()
class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      path: '/',
      maxAge: Number(this.configService.get('JWT_EXPIRATION_TIME')),
    };
  }

  public getJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
    return token;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async register(userData: RegisterationDto) {
    const hashedPassword = await this.hashPassword(userData.password);
    try {
      const createdUser = this.userService.create({
        ...userData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(loginData: LoginDto): Promise<User> {
    try {
      const { email, password } = loginData;
      const foundUser = await this.userService.getByEmail(email);
      await this.verifyPassword(password, foundUser.password);

      return foundUser;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const passwordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!passwordMatch) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default AuthenticationService;
