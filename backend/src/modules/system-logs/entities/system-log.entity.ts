import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SystemLogType } from '@/common/enums/system-log-type.enum';

@Entity('system_logs')
export class SystemLog extends BaseEntity {
  @Column('uuid', { nullable: true })
  @Index()
  userId: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  target: string;

  @Column({
    type: 'enum',
    enum: SystemLogType,
    default: SystemLogType.UPDATE,
  })
  type: SystemLogType;

  @Column({ nullable: true })
  ip: string;
}
