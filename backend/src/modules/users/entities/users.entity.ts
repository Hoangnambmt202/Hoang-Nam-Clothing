import { Entity, Column, OneToMany, Index, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@common/enums/role.enum';
import { Order } from '@/modules/sales/orders/entities/order.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { Address } from '../../shipping/addresss/entities/address.entity';
import { Cart } from '@/modules/sales/cart/entities/cart.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Wishlist } from '@/modules/wishlists/entities/wishlist.entity';

@Index(['email'])
@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];
}
