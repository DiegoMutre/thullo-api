import { IsEmail, MinLength } from 'class-validator';

export class LoginDataDTO {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
