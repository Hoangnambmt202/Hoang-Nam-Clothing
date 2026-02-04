// modules/payments/entities/payment-transaction.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/modules/sales/orders/entities/order.entity';

import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.transactions, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @Column({ unique: true })
  transactionId: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'jsonb', nullable: true })
  providerResponse?: Record<string, any>;
}
