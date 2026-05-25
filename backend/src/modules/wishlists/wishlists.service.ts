import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '@/modules/catalog/products/entities/product.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(userId: string): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.variants', 'product.variants.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: string, productId: string): Promise<Wishlist> {
    // Check if product exists
    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if already wishlisted
    const existing = await this.wishlistsRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existing) {
      throw new ConflictException('Product is already in your wishlist');
    }

    const wishlistItem = this.wishlistsRepository.create({
      user: { id: userId } as any,
      product: { id: productId } as any,
    });

    const saved = await this.wishlistsRepository.save(wishlistItem);
    
    // Return the newly created item with all relations populated
    const populated = await this.wishlistsRepository.findOne({
      where: { id: saved.id },
      relations: ['product', 'product.variants', 'product.variants.images'],
    });
    return populated as Wishlist;
  }

  async remove(userId: string, productId: string): Promise<void> {
    const wishlistItem = await this.wishlistsRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product is not in your wishlist');
    }

    await this.wishlistsRepository.remove(wishlistItem);
  }
}
