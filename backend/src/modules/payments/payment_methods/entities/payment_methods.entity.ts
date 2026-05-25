import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
  @Column({ unique: true })
  name: string; // e.g., "Thanh toán khi nhận hàng (COD)"

  @Column({ unique: true })
  provider: string; // e.g., "COD", "VNPAY", "MOMO", "BANK_TRANSFER"

  @Column()
  type: string; // e.g., "cash", "e_wallet", "bank_transfer"

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;
}
