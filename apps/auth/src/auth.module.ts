import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './constants/services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from '@app/common/database/database.service';
import { MqModule } from '@app/common/mq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/.env',
    }),
    MqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, ConfigService],
})
export class AuthModule {}
