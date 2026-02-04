// src/database/seeds/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '@/modules/users/entities/users.entity';
import { Category } from '@/modules/catalog/categories/entities/category.entity';
import { Brand } from '@/modules/catalog/brands/entities/brands.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';

import { ShippingMethod } from '@/modules/shipping/shipping_methods/entities/shipping_methods.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';
import { Address } from '@/modules/shipping/addresss/entities/address.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Kết nối DB (Copy từ AppModule hoặc dùng lại logic)
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: ['src/**/*.entity.ts'],
        migrations: ['src/config/migrations/*.ts'],
        synchronize: false,
        logging: true,
      }),
    }),
    // Đăng ký Feature Entity
    TypeOrmModule.forFeature([
      User,
      Category,
      Brand,
      Product,
      ProductVariant,
      ShippingMethod,
      Address,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
