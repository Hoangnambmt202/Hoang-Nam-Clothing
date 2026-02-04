import { Module } from '@nestjs/common';
import { OrderPromotionsModule } from './order_promotions/order_promotions.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [OrderPromotionsModule, PromotionsModule],
})
export class SalesModule {}
