import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      // It can be accessed as a service in any module
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
