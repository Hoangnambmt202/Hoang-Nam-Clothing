import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductVariant } from './product_variant.entity';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @ManyToOne(() => ProductVariant, (variant) => variant.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @Column()
  productVariantId: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ default: false })
  isThumbnail: boolean;
}
