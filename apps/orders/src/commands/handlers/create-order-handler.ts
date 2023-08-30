import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../impl/create-order-command';
import { OrdersRepository } from '../../repositories/orders.repository';
import { Order } from '@prisma/client';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly orderRepository: OrdersRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const data = {
      ...command,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const order = await this.orderRepository.create(data);

    this.sendEvent(order);

    return order;
  }

  async sendEvent(order: Order) {
    this.eventBus.publish('OrderCreated', {
      id: order.id,
    });
  }
}
