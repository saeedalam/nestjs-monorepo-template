import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { MqService } from '@app/common/mq/mq.service';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const mqService = app.get<MqService>(MqService);
  app.connectMicroservice(mqService.getOptions('BILLING', false));
  await app.startAllMicroservices();
}
bootstrap();
