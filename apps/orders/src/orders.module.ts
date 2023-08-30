import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { OrdersRepository } from './repositories/orders.repository';
import { GetOrderHandler } from './queries/handlers/get-order-handler';
import { DatabaseService } from '@app/common/database/database.service';
import { MqModule } from '@app/common/mq';
import { BILLING_SERVICE } from './constants/services';
import { ConfigModule, RedisModule } from '@app/common';
import { AuthService } from 'apps/auth/src/auth.service';

@Module({
  imports: [
    ConfigModule,
    MqModule.register({
      name: BILLING_SERVICE,
    }),
    RedisModule,
    CqrsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersRepository, GetOrderHandler, DatabaseService, AuthService],
})
export class OrdersModule {}
