// modules/sales/entities/order-promotion.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';

import { Promotion } from '@/modules/sales/promotions/entities/promotion.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('order_promotions')
export class OrderPromotion extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.promotions, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Promotion, { eager: true })
  promotion: Promotion;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;
}
