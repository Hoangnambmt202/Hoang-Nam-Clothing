import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // CREATE CATEGORY
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category name already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    const slug = slugify(createCategoryDto.name, { lower: true });
    category.slug = slug;
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findAllWithProductCount(): Promise<any[]> {
    const categories = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      .loadRelationCountAndMap(
        'category.productCount',
        'category.products',
        'product',
        (qb) => qb.andWhere('product.isActive = :isActive', { isActive: true }),
      )
      .getMany();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return categories.map((category) => {
      let thisMonthCount = 0;
      let lastMonthCount = 0;

      if (category.products) {
        category.products.forEach(product => {
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
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        productCount: (category as any).productCount || 0,
        growthRate,
        createdAt: category.createdAt
      };
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { name },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if new name already exists (if name is being updated)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.remove(category);
  }
}
