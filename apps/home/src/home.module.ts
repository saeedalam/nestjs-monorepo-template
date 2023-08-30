import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule, LoggerModule } from '@app/common';

@Module({
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    LoggerModule,
  ],
  imports: [DatabaseModule],
})
export class HomeModule {}
