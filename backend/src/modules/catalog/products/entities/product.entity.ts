import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from '@/modules/catalog/categories/entities/category.entity';
import { Brand } from '@/modules/catalog/brands/entities/brands.entity';
import { ProductVariant } from './product_variant.entity';
import { ProductImage } from './product_image.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Wishlist } from '@/modules/wishlists/entities/wishlist.entity';

@Entity('products')
@Index(['name']) // Index for search performance
@Index(['slug']) // Index for slug lookup
@Index(['categoryId']) // Index for category filtering
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  brandId: string;

  @Column({ default: true })
  isActive: boolean;

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

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];
}
