import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @MinLength(7, {
    message: 'Password must be at least 7 characters',
  })
  password: string;
}

export default LoginDto;
