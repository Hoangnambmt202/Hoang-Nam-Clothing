import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private imageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verify category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(queryDto: ProductQueryDto): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sizes,
      colors,
      inStock,
      isActive,
      page,
      limit,
    } = queryDto;

    let query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // Apply filters
    if (search) {
      query = query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categoryId) {
      query = query.andWhere('product.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (minPrice !== undefined) {
      query = query.andWhere(
        '(COALESCE(product.salePrice, product.price) >= :minPrice)',
        { minPrice },
      );
    }

    if (maxPrice !== undefined) {
      query = query.andWhere(
        '(COALESCE(product.salePrice, product.price) <= :maxPrice)',
        { maxPrice },
      );
    }

    if (sizes && sizes.length > 0) {
      query = query.andWhere('product.sizes && :sizes', { sizes });
    }

    if (colors && colors.length > 0) {
      query = query.andWhere('product.colors && :colors', { colors });
    }

    if (inStock !== undefined) {
      if (inStock) {
        query = query.andWhere('product.stock > 0');
      } else {
        query = query.andWhere('product.stock = 0');
      }
    }

    if (isActive !== undefined) {
      query = query.andWhere('product.isActive = :isActive', { isActive });
    }
    const currentPage = page ?? 1;
    const pageSize = limit ?? 10;

    const offset = (currentPage - 1) * pageSize;

    query = query.skip(offset).take(pageSize);

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'images', 'brand'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findFeatured(limit: number = 10): Promise<Product[]> {
    return this.productsRepository.find({
      where: { is_available: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRelated(productId: string, limit: number = 4): Promise<Product[]> {
    // Tìm product để lấy categoryId
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productsRepository.find({
      where: {
        categoryId: product.categoryId,
        is_available: true,
        id: Not(productId),
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify category exists if being updated
    if (updateProductDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['orderItems', 'cartItems'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product has orders or cart items
    if (product.orderItems && product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product with existing orders',
      );
    }

    if (product.cartItems && product.cartItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product with existing cart items',
      );
    }

    await this.productsRepository.remove(product);
  }

  async updateStock(
    id: string,
    quantity: number,
    operation: 'increase' | 'decrease' = 'decrease',
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (operation === 'decrease') {
      if (product.stock_quantity < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
      product.stock_quantity -= quantity;
    } else {
      product.stock_quantity += quantity;
    }

    return this.productsRepository.save(product);
  }

  async getProductStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
  }> {
    const [total, active, inactive, outOfStock, lowStock] = await Promise.all([
      this.productsRepository.count(),
      this.productsRepository.count({ where: { is_available: true } }),
      this.productsRepository.count({ where: { is_available: false } }),
      this.productsRepository.count({ where: { stock_quantity: 0 } }),
      this.productsRepository.count({
        where: { stock_quantity: LessThanOrEqual(10) },
      }),
    ]);

    return {
      total,
      active,
      inactive,
      outOfStock,
      lowStock,
    };
  }

  async searchProducts(
    searchTerm: string,
    limit: number = 10,
  ): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where(
        'product.name ILIKE :search OR product.description ILIKE :search',
        {
          search: `%${searchTerm}%`,
        },
      )
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  async getFilters(): Promise<{
    categories: { id: string; name: string }[];
    sizes: string[];
    colors: string[];
    priceRange: { min: number; max: number };
  }> {
    const categories = await this.categoriesRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    const sizeQuery = await this.productsRepository
      .createQueryBuilder('product')
      .select('UNNEST(product.sizes)', 'size')
      .distinct(true)
      .getRawMany<{ size: string }>();

    const colorQuery = await this.productsRepository
      .createQueryBuilder('product')
      .select('UNNEST(product.colors)', 'color')
      .distinct(true)
      .getRawMany<{ color: string }>();

    const priceQuery = await this.productsRepository
      .createQueryBuilder('product')
      .select('MIN(COALESCE(product.salePrice, product.price))', 'min')
      .addSelect('MAX(COALESCE(product.salePrice, product.price))', 'max')
      .where('product.isActive = :isActive', { isActive: true })
      .getRawOne<{ min: string; max: string }>();

    const sizes = sizeQuery.map((item) => item.size).filter(Boolean);
    const colors = colorQuery.map((item) => item.color).filter(Boolean);

    return {
      categories,
      sizes,
      colors,
      priceRange: {
        min: parseFloat(priceQuery?.min ?? '0'),
        max: parseFloat(priceQuery?.max ?? '0'),
      },
    };
  }
  // products.service.ts
  async createVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log('dto', dto);
    const variant = this.variantRepository.create({
      ...dto, // 👈 đảm bảo map color, size, sku...
      productId, // productId từ param
    });

    return this.variantRepository.save(variant);
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    await this.variantRepository.update(id, dto);
    return this.variantRepository.findOne({ where: { id } });
  }

  async deleteVariant(id: string) {
    return this.variantRepository.delete(id);
  }

  async createImage(dto: CreateImageDto) {
    const image = this.imageRepository.create({
      ...dto,
      product: { id: dto.productId },
    });
    return this.imageRepository.save(image);
  }

  async updateImage(id: string, dto: UpdateImageDto) {
    await this.imageRepository.update(id, dto);
    return this.imageRepository.findOne({ where: { id } });
  }

  async deleteImage(id: string) {
    return this.imageRepository.delete(id);
  }
}
