import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from '../impl/get-order-query';
import { DatabaseService } from '@app/common/database/database.service';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetOrderQuery): Promise<any> {
    return this.databaseService.order.findUnique({
      where: {
        id: query.id,
      },
    });
  }
}
