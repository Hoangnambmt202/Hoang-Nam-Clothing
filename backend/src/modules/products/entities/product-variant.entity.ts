import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ length: 20, nullable: true })
  size: string;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price_modifier: number;

  @Column('int', { default: 0 })
  stock_quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
