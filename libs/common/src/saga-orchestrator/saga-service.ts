import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'apps/orders/src/dto/create.order.dto';
import { MqService } from '../mq/mq.service';

@Injectable()
@Injectable()
export class SagaService {
  constructor(private readonly mqService: MqService) {}

  async startOrderSaga(createOrderDto: CreateOrderDto) {
    try {
      // Emit an event to initiate the saga
      //   await this.mqService.emit(EVENT_ORDER_CREATED, createOrderDto).toPromise();
    } catch (error) {
      // Handle error when initiating saga
      console.error('Error starting order saga:', error);
      throw new Error('Failed to start order saga');
    }
  }

  async handleOrderCreatedEvent(orderId: string, retryCount = 0) {
    try {
      // Perform actions related to order creation...
      await this.performOrderCreation(orderId);

      // If successful, continue with the next step

      //   await this.mqService.emit(EVENT_PAYMENT_SUCCESSFUL, { orderId }).toPromise();
    } catch (error) {
      if (retryCount < 3) {
        // Retry the step after a delay
        await this.retryAfterDelay(() =>
          this.handleOrderCreatedEvent(orderId, retryCount + 1),
        );
      } else {
        // If retries exhausted, handle failure
        await this.handleStepFailure('orderCreated', orderId, error);
      }
    }
  }

  async performOrderCreation(orderId: string) {
    // Simulate order creation process...
    if (Math.random() < 0.8) {
      console.log(`Order ${orderId} created successfully`);
    } else {
      throw new Error(`Failed to create order ${orderId}`);
    }
  }

  async handlePaymentSuccessfulEvent(orderId: string) {
    try {
      // Perform actions related to successful payment...
      await this.performPaymentSuccess(orderId);

      // Saga completes successfully
    } catch (error) {
      await this.handleStepFailure('paymentSuccessful', orderId, error);
    }
  }

  async performPaymentSuccess(orderId: string) {
    // Simulate payment success process...
    console.log(`Payment successful for order ${orderId}`);
  }

  async handlePaymentFailedEvent(orderId: string) {
    // Perform compensating actions for the failed payment...
    await this.performPaymentCompensation(orderId);
  }

  async performPaymentCompensation(orderId: string) {
    // Simulate compensating actions for the failed payment...
    console.log(
      `Compensating actions performed for failed payment of order ${orderId}`,
    );
  }

  async handleStepFailure(step: string, orderId: string, error: any) {
    console.error(`Step ${step} failed for order ${orderId}:`, error);

    // Trigger compensating actions based on the failed step
    if (step === 'orderCreated') {
      await this.handleOrderCreationFailure(orderId);
    } else if (step === 'paymentSuccessful') {
      await this.handlePaymentFailure(orderId);
    }
  }

  async handleOrderCreationFailure(orderId: string) {
    // Perform compensating actions for the failed order creation...
    await this.performOrderCreationCompensation(orderId);
  }

  async performOrderCreationCompensation(orderId: string) {
    // Simulate compensating actions for the failed order creation...
    console.log(
      `Compensating actions performed for failed order creation of order ${orderId}`,
    );
  }

  async handlePaymentFailure(orderId: string) {
    // Perform compensating actions for the failed payment...
    await this.performPaymentCompensation(orderId);
  }

  async retryAfterDelay(callback: () => Promise<any>, delayMs = 5000) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await callback();
  }
}
