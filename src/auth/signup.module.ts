import { Module } from '@nestjs/common';
import { SignupController } from 'src/auth/signup.controller';
import { SignupService } from 'src/auth/signup.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SignupController],
  providers: [SignupService, PrismaService],
})
export class SignupModule {}
