import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from '@/modules/sales/cart/entities/cart.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.cartItems)
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
