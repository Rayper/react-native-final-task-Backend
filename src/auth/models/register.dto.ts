import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Min(6)
  password: string;

  @IsNotEmpty()
  @Min(6)
  password_confirm: string;
}
