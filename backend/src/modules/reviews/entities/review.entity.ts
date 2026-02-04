// modules/catalog/entities/review.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { User } from '@/modules/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ default: false })
  isApproved: boolean;
}
