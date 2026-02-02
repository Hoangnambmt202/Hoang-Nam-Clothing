import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { Category } from '@modules/categories/entities/category.entity';
import { OrderItem } from '@modules/orders/entities/order-item.entity';
import { CartItem } from '@modules/cart/entities/cart-item.entity';
import slugify from 'slugify';
import { Brand } from '@/modules/brands/entities/brands.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
@Index(['name']) // Index for search performance
@Index(['slug']) // Index for slug lookup
@Index(['price']) // Index for price filtering
@Index(['categoryId']) // Index for category filtering
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({
    type: 'bool',
    default: true,
  })
  is_available: boolean;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  brandId: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        locale: 'vi', // hỗ trợ tiếng Việt
      });
    }
  }

  // Virtual properties
  // get currentPrice(): number {
  //   return this.salePrice || this.price;
  // }

  // get discountPercent(): number {
  //   if (!this.salePrice) return 0;
  //   return Math.round(((this.price - this.salePrice) / this.price) * 100);
  // }

  // get isOnSale(): boolean {
  //   return !!this.salePrice && this.salePrice > 0;
  // }

  // get isInStock(): boolean {
  //   return this.stock > 0;
  // }

  // get isLowStock(): boolean {
  //   return this.stock > 0 && this.stock <= 10;
  // }

  // get stockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
  //   if (this.stock === 0) return 'out-of-stock';
  //   if (this.stock <= 10) return 'low-stock';
  //   return 'in-stock';
  // }
}
