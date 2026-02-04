// modules/users/entities/wishlist.entity.ts
import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';
import { User } from '@/modules/users/entities/users.entity';

import { Entity, ManyToOne, Unique } from 'typeorm';

@Entity('wishlists')
@Unique(['user', 'product'])
export class Wishlist extends BaseEntity {
  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;
}
