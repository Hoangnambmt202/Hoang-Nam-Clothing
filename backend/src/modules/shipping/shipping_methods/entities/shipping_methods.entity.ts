// modules/sales/entities/shipping-method.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/modules/sales/orders/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('shipping_methods')
export class ShippingMethod extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  //Giá cơ bản
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseCost: number;

  //Ước tính ngày giao
  @Column({ nullable: true })
  estimatedDays?: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.shippingMethod)
  orders: Order[];
}
