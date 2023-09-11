import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SignupService {
  constructor(private prismaService: PrismaService) {}

  async createUser(userData: Prisma.UserCreateInput) {
    await this.prismaService.user.create({
      data: userData,
    });
  }
}
