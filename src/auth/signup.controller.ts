import { Controller, Post, Body, UsePipes } from '@nestjs/common';
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
  async createUser(@Body() userData: UserDataDTO) {
    await this.signupService.createUser(userData);
  }
}
