import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '@/modules/sales/orders/entities/order.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.orderItems)
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @Column({ nullable: true })
  productVariantId: string;

  //option: lấy thông tin chung của sản phẩm
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  productName: string; // Lưu tên lúc mua: "Áo Polo"

  @Column()
  sku: string; // Lưu SKU lúc mua: "POLO-RED-M"

  @Column()
  color: string; // Snapshot màu: "Red"

  @Column()
  size: string; // Snapshot size: "M"

  @Column('decimal')
  price: number; // Giá lúc mua

  @Column('int')
  quantity: number;
}
