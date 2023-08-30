import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqService } from '@app/common/mq/mq.service';

async function bootstrap() {
  // const app = await NestFactory.create(AuthModule);
  // await app.listen(4000);

  const app = await NestFactory.create(AuthModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const rmqService = app.get<MqService>(MqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_PORT'));
}
bootstrap();
