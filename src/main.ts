import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable reading/setting cookies
  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  app.enableCors({
    origin: process.env.CLIENT_URL, // Reads from the environment variable
    credentials: true, // This allows to send the cookies, I'm not sure why but check https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie
  });
  await app.listen(4000);
}
bootstrap();
