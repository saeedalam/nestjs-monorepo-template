// decorators.ts
import { EventPattern } from '@nestjs/microservices';
import {
  EVENT_ORDER_CREATED,
  EVENT_PAYMENT_FAILED,
  EVENT_PAYMENT_SUCCESSFUL,
} from './shared-events.module';

export const OrderCreatedEvent = () => EventPattern(EVENT_ORDER_CREATED);
export const PaymentFailedEvent = () => EventPattern(EVENT_PAYMENT_FAILED);
export const PaymentSuccessfulEvent = () =>
  EventPattern(EVENT_PAYMENT_SUCCESSFUL);
