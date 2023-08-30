// shared-events.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class SharedEventsModule {}

// shared-events.constants.ts
export const EVENT_ORDER_CREATED = 'order-created';
export const EVENT_PAYMENT_SUCCESSFUL = 'payment-successful';
export const EVENT_PAYMENT_FAILED = 'payment-failed';
