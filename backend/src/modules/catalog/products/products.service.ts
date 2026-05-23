import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import slugify from 'slugify';
import { Category } from '../categories/entities/category.entity';
import { ProductVariant } from './entities/product_variant.entity';
import { ProductImage } from './entities/product_image.entity';
import { CloudinaryService } from '../../files/cloudinary.service';

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
    private cloudinaryService: CloudinaryService,
  ) {}

  // CREATE PRODUCT
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verify primary category exists
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Resolve multi-category list
    let categoriesList: Category[] = [category];
    if (createProductDto.categoryIds && createProductDto.categoryIds.length > 0) {
      categoriesList = await this.categoriesRepository.find({
        where: { id: In(createProductDto.categoryIds) },
      });
      // Set primary categoryId to first in list for backward compat
      if (categoriesList.length > 0 && !createProductDto.categoryIds.includes(createProductDto.categoryId)) {
        createProductDto.categoryId = categoriesList[0].id;
      }
    }

    // create slug
    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
    let i = 1;
    let finalSlug = slug;

    while (
      await this.productsRepository.findOne({ where: { slug: finalSlug } })
    ) {
      finalSlug = `${slug}-${i++}`;
    }

    const { categoryIds, ...restDto } = createProductDto;
    const product = this.productsRepository.create({
      ...restDto,
      slug: finalSlug,
      categories: categoriesList,
    });
    return this.productsRepository.save(product);
  }

  // FIND ALL PRODUCTS
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
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('variants.images', 'images');

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

    if (queryDto.brandId) {
      query = query.andWhere('product.brandId = :brandId', {
        brandId: queryDto.brandId,
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
      query = query.andWhere('variants.size IN (:...sizes)', { sizes });
    }

    if (colors && colors.length > 0) {
      query = query.andWhere('variants.color IN (:...colors)', { colors });
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
      relations: ['category', 'categories', 'variants', 'variants.images', 'brand'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // tìm sản phẩm liên quan
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
        isActive: true,
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

  // xóa sản phẩm
  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['variants', 'variants.images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.images) {
          for (const image of variant.images) {
            if (image.url) {
              await this.cloudinaryService.deleteImageByUrl(image.url);
            }
          }
        }
      }
    }

    await this.productsRepository.remove(product);
  }

  async updateStock(
    id: string,
    quantity: number,
    operation: 'increase' | 'decrease' = 'decrease',
  ): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({
      where: { productId: id },
    });

    if (!variant) {
      throw new NotFoundException('Product not found');
    }

    if (operation === 'decrease') {
      if (variant.stockQuantity < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
      variant.stockQuantity -= quantity;
    } else {
      variant.stockQuantity += quantity;
    }
    return this.variantRepository.save(variant);
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
      this.productsRepository.count({ where: { isActive: true } }),
      this.productsRepository.count({ where: { isActive: false } }),
      this.variantRepository.count({ where: { stockQuantity: 0 } }),
      this.variantRepository.count({
        where: { stockQuantity: LessThanOrEqual(10) },
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

    const sizeQuery = await this.variantRepository
      .createQueryBuilder('variant')
      .innerJoin('variant.product', 'product')
      .select('variant.size', 'size')
      .where('product.isActive = :isActive', { isActive: true })
      .distinct(true)
      .getRawMany<{ size: string }>();

    const colorQuery = await this.variantRepository
      .createQueryBuilder('variant')
      .innerJoin('variant.product', 'product')
      .select('variant.color', 'color')
      .where('product.isActive = :isActive', { isActive: true })
      .distinct(true)
      .getRawMany<{ color: string }>();

    const priceQuery = await this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.variants', 'variant')
      .select('MIN(variant.price)', 'min')
      .addSelect('MAX(variant.price)', 'max')
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
  async createVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log('dto', dto);
    const variant = this.variantRepository.create({
      ...dto,
      price: dto.price ?? dto.price_modifier ?? 0,
      stockQuantity: dto.stockQuantity ?? dto.stock_quantity ?? 0,
      productId, // productId từ param
    });

    try {
      return await this.variantRepository.save(variant);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Mã SKU "${dto.sku}" đã tồn tại. Vui lòng tạo SKU khác.`);
      }
      throw error;
    }
  }

  async findAllVariants() {
    return this.variantRepository.find({
      relations: ['product', 'images'],
    });
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    const updateData: any = { ...dto };
    if (dto.price !== undefined) updateData.price = dto.price;
    else if (dto.price_modifier !== undefined) updateData.price = dto.price_modifier;

    if (dto.stockQuantity !== undefined) updateData.stockQuantity = dto.stockQuantity;
    else if (dto.stock_quantity !== undefined) updateData.stockQuantity = dto.stock_quantity;

    await this.variantRepository.update(id, updateData);
    return this.variantRepository.findOne({ where: { id } });
  }

  async deleteVariant(id: string) {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (variant && variant.images) {
      for (const image of variant.images) {
        if (image.url) {
          await this.cloudinaryService.deleteImageByUrl(image.url);
        }
      }
    }
    return this.variantRepository.delete(id);
  }

  async createImage(dto: CreateImageDto) {
    let imageUrl = dto.url;

    // If the URL is a base64 data URL, upload to Cloudinary
    if (imageUrl.startsWith('data:image/')) {
      const result = await this.cloudinaryService.uploadImage(imageUrl);
      imageUrl = result.secure_url;
    }

    const isThumbnail = dto.is_thumbnail !== undefined 
      ? dto.is_thumbnail 
      : (dto as any).isThumbnail ?? false;

    const image = this.imageRepository.create({
      url: imageUrl,
      isThumbnail,
      productVariant: { id: dto.productVariantId },
    });
    return this.imageRepository.save(image);
  }

  async updateImage(id: string, dto: UpdateImageDto) {
    const updateData: any = {};
    if (dto.url !== undefined) updateData.url = dto.url;
    
    if (dto.is_thumbnail !== undefined) {
      updateData.isThumbnail = dto.is_thumbnail;
    } else if ((dto as any).isThumbnail !== undefined) {
      updateData.isThumbnail = (dto as any).isThumbnail;
    }

    await this.imageRepository.update(id, updateData);
    return this.imageRepository.findOne({ where: { id } });
  }

  async deleteImage(id: string) {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (image && image.url) {
      await this.cloudinaryService.deleteImageByUrl(image.url);
    }
    return this.imageRepository.delete(id);
  }
}
