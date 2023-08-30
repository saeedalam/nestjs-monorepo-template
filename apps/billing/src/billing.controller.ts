import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MqService } from '@app/common/mq/mq.service';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly mqService: MqService,
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('order-created')
  async orderCreatedHandler(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.billingService.bill(data);
    await this.mqService.ack(context);
  }

  // all listerner for failure situation
  @EventPattern('payment-failed')
  async paymentFailedHandler(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.billingService.bill(data);
    await this.mqService.ack(context);
  }
}
