import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterationDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsString({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(7, {
    message: 'Password must be at least 7 characters',
  })
  password: string;
}

export default RegisterationDto;
