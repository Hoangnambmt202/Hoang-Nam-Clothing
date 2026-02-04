import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '@/modules/users/entities/users.entity';
import { OrderItem } from '@/modules/sales/orders/entities/order-item.entity';
import { OrderStatus } from '@common/enums/order-status.enum';
import { BaseEntity } from '@/common/entities/base.entity';
import { ShippingMethod } from '@/modules/shipping/shipping_methods/entities/shipping_methods.entity';
import { OrderPromotion } from '../../order_promotions/entities/order_promotion.entity';
import { PaymentTransaction } from '@/modules/payments/payment_transactions/entities/payment_transaction.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  //totalAmount (tổng tiền hàng)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  //finalAmount (sau giảm giá + ship)
  @Column('decimal', { precision: 10, scale: 2 })
  finalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => ShippingMethod)
  shippingMethod: ShippingMethod;

  @OneToMany(() => OrderPromotion, (op) => op.order, { cascade: true })
  promotions: OrderPromotion[];

  @OneToMany(() => PaymentTransaction, (tx) => tx.order)
  transactions: PaymentTransaction[];
}
