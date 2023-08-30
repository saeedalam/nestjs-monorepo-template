import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ConfigModule } from '@nestjs/config';
// import Joi from 'joi';
import * as Joi from '@hapi/joi';
import { NOTIFICATION_SERVICE } from '../constants/services';
import { MqModule } from '@app/common/mq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: './apps/orders/.env',
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
    MqModule.register({
      name: NOTIFICATION_SERVICE,
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
