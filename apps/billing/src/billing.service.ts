import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '../constants/services';

@Injectable()
export class BillingService {
  private logger = new Logger('Billing');
  constructor(
    @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  bill(data: any) {
    // this.notificationClient.e
    // console.log('Bill created');
    this.logger.log('Bill created.', data);
    this.notificationClient.emit('bill-created', {
      bill: { bill_id: 123, info: 'bill info' },
      ...data,
    });

    // this.notificationClient.
  }
}
