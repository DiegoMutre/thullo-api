import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SignupModule } from 'src/auth/signup.module';

@Module({
  imports: [
    SignupModule,
    ConfigModule.forRoot({
      // It can be accessed as a service in any module
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
