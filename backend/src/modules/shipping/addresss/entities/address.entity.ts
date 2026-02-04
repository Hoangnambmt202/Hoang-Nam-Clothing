import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/users.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index(['userId'])
@Entity('addresses')
export class Address extends BaseEntity {
  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column()
  street: string;

  @Column({ default: 'VN' })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  recipientName: string;

  @Column()
  phoneNumber: string;
}
