import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async createUser(data: Prisma.UserCreateInput, res: Response) {
    // Rounds to be used to hash the password
    const rounds = 10;

    // Hash the password
    const password = await bcrypt.hash(data.password, rounds);

    // Save the encrypted password
    const userCreated = await this.prismaService.user.create({
      data: {
        ...data,
        password,
      },
      // Select this data to be returned
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    // Create access token
    const accessToken = jwt.sign(
      userCreated,
      this.configService.get('SECRET_KEY'),
      {
        expiresIn: '5m', // Expires in five minutes
      },
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      userCreated,
      this.configService.get('SECRET_KEY'),
      {
        expiresIn: '30 days',
      },
    );

    // Save the refresh token in the user collection
    // Yeah, I know that this can be better because I'm querying the database again which doesn't
    // seem to be the most optimal way
    await this.prismaService.user.update({
      where: {
        id: userCreated.id,
      },
      data: {
        refreshToken,
      },
    });

    // Set a http-only cookie with the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      // It expires but in a date far in the future, though it can be unnecessary because
      // the refresh token expires in 30 days
      expires: new Date(2147483647000),
    });

    // Return access token
    return {
      accessToken,
    };
  }
}
