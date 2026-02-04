import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { CartItem } from '@/modules/sales/cart/entities/cart-item.entity';
import { OrderItem } from '@/modules/sales/orders/entities/order-item.entity';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ length: 20, nullable: true })
  size: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column('int', { default: 0 })
  stockQuantity: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariant)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.productVariant)
  cartItems: CartItem[];
}
