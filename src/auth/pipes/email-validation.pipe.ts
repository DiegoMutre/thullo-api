import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDataDTO } from 'src/auth/dtos/userdata.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  private prisma: PrismaService;
  constructor() {
    // I'm not sure if this is a good practice
    this.prisma = new PrismaService();
  }

  async transform(value: UserDataDTO) {
    const userWithThatEmail = await this.prisma.user.findFirst({
      where: {
        email: value.email,
      },
    });

    if (!!userWithThatEmail) {
      // The reason why I return a `200` http status code is because there's no anything wrong with the client
      // See https://stackoverflow.com/questions/9269040/which-http-response-code-for-this-email-is-already-registered#:~:text=Returning%20a%20200%20OK%20and,like%20login%20or%20password%20change.
      throw new HttpException('Email already used', HttpStatus.OK);
    }

    return value;
  }
}
