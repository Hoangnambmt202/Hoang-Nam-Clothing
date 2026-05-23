// src/modules/brands/brands.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brands.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import slugify from 'slugify';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const exists = await this.brandsRepository.findOne({
      where: { name: createBrandDto.name },
    });
    if (exists) {
      throw new BadRequestException('Brand already exists');
    }

    const slug = slugify(createBrandDto.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });

    const brand = this.brandsRepository.create({
      ...createBrandDto,
      slug,
    });

    return await this.brandsRepository.save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return this.brandsRepository.find({ order: { name: 'ASC' } });
  }

  async findAllWithStats(): Promise<any[]> {
    const brands = await this.brandsRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.products', 'product', 'product.isActive = :isActive', { isActive: true })
      .getMany();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return brands.map((brand) => {
      let thisMonthCount = 0;
      let lastMonthCount = 0;

      if (brand.products) {
        brand.products.forEach(product => {
          if (product.createdAt >= thirtyDaysAgo) {
            thisMonthCount++;
          } else if (product.createdAt >= sixtyDaysAgo && product.createdAt < thirtyDaysAgo) {
            lastMonthCount++;
          }
        });
      }

      let growthRate = 0;
      if (lastMonthCount === 0) {
        growthRate = thisMonthCount > 0 ? 100 : 0;
      } else {
        growthRate = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
      }

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        productCount: brand.products ? brand.products.length : 0,
        growthRate,
        createdAt: brand.createdAt
      };
    });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return this.brandsRepository.save(brand);
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandsRepository.remove(brand);
  }
}
