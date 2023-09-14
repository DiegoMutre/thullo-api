import { Controller, Post, Body, UsePipes, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDataDTO } from 'src/auth/dtos/userdata.dto';
import { EmailValidationPipe } from 'src/auth/pipes/email-validation.pipe';
import { AuthService } from 'src/auth/auth.service';
import { LoginDataDTO } from 'src/auth/dtos/logindata.dto';

@Controller({
  path: '/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(EmailValidationPipe)
  async signup(
    @Body() userData: UserDataDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.createUser(userData, response);
  }

  @Post('/login')
  async login(
    @Body() userCredentials: LoginDataDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(userCredentials, response);
  }
}
