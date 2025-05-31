import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateAuthUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(['USER', 'ADMIN'])
  @IsNotEmpty()
  role: string;
}
