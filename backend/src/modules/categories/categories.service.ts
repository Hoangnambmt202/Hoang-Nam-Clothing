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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category name already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['products'],
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

    return categories.map((category) => ({
      ...category,
      productCount: category.productCount || 0,
    }));
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

    if (category.products && category.products.length > 0) {
      throw new ConflictException(
        'Cannot delete category with existing products',
      );
    }

    await this.categoriesRepository.remove(category);
  }

  async getCategoryStats(id: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
  }> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const totalProducts = category.products?.length || 0;
    const activeProducts =
      category.products?.filter((p) => p.isActive).length || 0;
    const inactiveProducts = totalProducts - activeProducts;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
    };
  }
}
