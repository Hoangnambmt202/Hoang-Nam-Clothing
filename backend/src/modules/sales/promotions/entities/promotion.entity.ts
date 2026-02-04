// modules/marketing/entities/promotion.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderPromotion } from '../../order_promotions/entities/order_promotion.entity';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed_amount',
}

@Entity('promotions')
export class Promotion extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: DiscountType })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount?: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderPromotion, (op) => op.promotion)
  orderPromotions: OrderPromotion[];
}
