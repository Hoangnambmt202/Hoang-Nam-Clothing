import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ length: 255 })
  url: string;

  @Column({ default: false })
  isThumbnail: boolean;
}
