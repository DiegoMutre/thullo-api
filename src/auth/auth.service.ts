import { Prisma } from '@prisma/client';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LoginDataDTO } from 'src/auth/dtos/logindata.dto';
import { exclude } from 'src/utils/exclude';

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

    // Create access token and refresh token
    const { accessToken, refreshToken } = this.createJWT(userCreated);

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
    this.setRefreshTokenCookie(res, refreshToken);

    // Return access token
    return {
      accessToken,
    };
  }

  async login(userCredentials: LoginDataDTO, res: Response) {
    // Check if the email is correct
    const user = await this.prismaService.user.findFirst({
      where: {
        email: userCredentials.email,
      },
    });

    // If the email isn't found, throw error about wrong credentials
    if (!user) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(
      userCredentials.password,
      user.password,
    );

    // If the password is incorrect, throw error
    if (!passwordCorrect) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Removes the password and refreshToken from the user object
    const userToReturn = exclude(user, ['password', 'refreshToken']);

    // Create access token and refresh token
    const { accessToken, refreshToken } = this.createJWT(userToReturn);

    // Set the refresh token in the DB and send a http-only cookie with the refresh token
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    this.setRefreshTokenCookie(res, refreshToken);

    // Return the access token created, id, email and username
    return {
      accessToken,
      ...userToReturn,
    };
  }

  /**
   * Set a http-only cookie in the client browser
   * If this doesn't work, is likely because the response object wasn't enabled to `passThrough`
   * See: https://docs.nestjs.com/controllers#library-specific-approach
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      // It expires but in a date far in the future, though it can be unnecessary because
      // the refresh token expires in 30 days
      expires: new Date(2147483647000),
    });
  }

  /**
   * Creates access and refresh json web tokens
   */
  private createJWT(payload: string | object | Buffer) {
    return {
      accessToken: jwt.sign(payload, this.configService.get('SECRET_KEY'), {
        expiresIn: '5m', // 5 minutes
      }),
      refreshToken: jwt.sign(payload, this.configService.get('SECRET_KEY'), {
        expiresIn: '30 days',
      }),
    };
  }
}
