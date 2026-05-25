import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '@/modules/sales/orders/entities/order.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.orderItems, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @Column({ nullable: true })
  productVariantId: string;

  //option: lấy thông tin chung của sản phẩm
  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: string;

  @Column('decimal')
  price: number; // Giá lúc mua

  @Column('int')
  quantity: number;
}
