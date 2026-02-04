// src/database/seeds/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // npm i bcrypt @types/bcrypt

// Import các Entity
import { User } from '@/modules/users/entities/users.entity';
import { Role } from '@/common/enums/role.enum';
import { Category } from '@/modules/catalog/categories/entities/category.entity';
import { Brand } from '@/modules/catalog/brands/entities/brands.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';

import { ShippingMethod } from '@/modules/shipping/shipping_methods/entities/shipping_methods.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    @InjectRepository(ShippingMethod)
    private shippingRepo: Repository<ShippingMethod>,
  ) {}

  async seed() {
    this.logger.log('🌱 Starting seeding...');

    await this.seedUsers();
    await this.seedShippingMethods();
    await this.seedCatalog();

    this.logger.log('✅ Seeding completed!');
  }

  // 1. Seed Users
  private async seedUsers() {
    const adminEmail = 'admin@gmail.com';
    const exists = await this.userRepo.findOneBy({ email: adminEmail });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await this.userRepo.save({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: Role.ADMIN,
        isActive: true,
      });
      this.logger.log('Created Admin user');
    }

    const customerEmail = 'customer@example.com';
    const custExists = await this.userRepo.findOneBy({ email: customerEmail });
    if (!custExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await this.userRepo.save({
        email: customerEmail,
        password: hashedPassword,
        firstName: 'Nguyen',
        lastName: 'Van A',
        role: Role.CUSTOMER,
        isActive: true,
      });
      this.logger.log('Created Customer user');
    }
  }

  // 2. Seed Shipping Methods
  private async seedShippingMethods() {
    const methods = [
      {
        name: 'Tiêu chuẩn',
        baseCost: 30000,
        estimatedDays: 5,
        description: 'Giao hàng tiết kiệm',
      },
      {
        name: 'Hỏa tốc',
        baseCost: 70000,
        estimatedDays: 1,
        description: 'Giao trong 24h',
      },
    ];

    for (const m of methods) {
      const exists = await this.shippingRepo.findOneBy({ name: m.name });
      if (!exists) {
        await this.shippingRepo.save(m);
      }
    }
    this.logger.log('Seeded Shipping Methods');
  }

  // 3. Seed Catalog (Category -> Brand -> Product -> Variant)
  private async seedCatalog() {
    // --- Categories ---
    let catMen = await this.categoryRepo.findOneBy({ slug: 'thoi-trang-nam' });
    if (!catMen) {
      catMen = await this.categoryRepo.save({
        name: 'Thời trang Nam',
        slug: 'thoi-trang-nam',
        description: 'Quần áo cho nam giới',
      });
    }

    // --- Brands ---
    let brandNike = await this.brandRepo.findOneBy({ slug: 'nike' });
    if (!brandNike) {
      brandNike = await this.brandRepo.save({
        name: 'Nike',
        slug: 'nike',
        description: 'Just do it',
      });
    }

    // --- Product & Variants ---
    const productSlug = 'ao-thun-basic-nike';
    let product = await this.productRepo.findOneBy({ slug: productSlug });

    if (!product) {
      // Tạo Product cha
      product = await this.productRepo.save({
        name: 'Áo Thun Basic Nike',
        slug: productSlug,
        description: 'Áo thun cotton 100% thấm hút mồ hôi',
        category: catMen,
        brand: brandNike,
        tags: ['basic', 'cotton', 'summer'],
        isActive: true,
      });

      // Tạo Variants (SKU)
      const variants = [
        {
          sku: 'NIKE-BASIC-W-S',
          color: 'White',
          size: 'S',
          stockQuantity: 100,
          price: 500000, // Giá hiển thị
        },
        {
          sku: 'NIKE-BASIC-W-M',
          color: 'White',
          size: 'M',
          stockQuantity: 50,
          price: 500000, // Giá hiển thị
        },
        {
          sku: 'NIKE-BASIC-B-S',
          color: 'Black',
          size: 'S',
          stockQuantity: 100,
          price: 600000, // Giá hiển thị
        }, // Màu đen đắt hơn 20k
      ];

      for (const v of variants) {
        await this.variantRepo.save({
          ...v,
          product: product, // Link vào product cha
          productId: product.id,
        });
      }
      this.logger.log('Created Product: Áo Thun Basic Nike with 3 variants');
    }
  }
}
