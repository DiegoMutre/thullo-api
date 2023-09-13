import { Controller, Post, Body, UsePipes, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDataDTO } from 'src/auth/dtos/userdata.dto';
import { EmailValidationPipe } from 'src/auth/pipes/email-validation.pipe';
import { SignupService } from 'src/auth/signup.service';

@Controller({
  path: '/auth/signup',
})
export class SignupController {
  constructor(private signupService: SignupService) {}

  @Post()
  @UsePipes(EmailValidationPipe)
  async createUser(
    @Body() userData: UserDataDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.signupService.createUser(userData, response);
  }
}
