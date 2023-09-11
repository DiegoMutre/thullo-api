import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserDataDTO {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
