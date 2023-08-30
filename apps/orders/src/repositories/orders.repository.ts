import { DatabaseService } from '@app/common/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(data: any) {
    return this.databaseService.order.create({
      data: data,
    });
  }
}
