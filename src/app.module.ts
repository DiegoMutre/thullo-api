import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SignupModule } from 'src/auth/signup.module';

@Module({
  imports: [SignupModule, ConfigModule.forRoot()],
})
export class AppModule {}
