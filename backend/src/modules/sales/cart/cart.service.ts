import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '@/modules/catalog/products/entities/product_variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.productVariant', 'items.productVariant.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, totalAmount: 0 });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<Cart> {
    const cart = await this.getCart(userId);

    const variant = await this.variantRepository.findOne({
      where: { id: dto.productVariantId },
      relations: ['product']
    });

    if (!variant || variant.productId !== dto.productId) {
      throw new BadRequestException('Invalid product variant');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productVariantId: dto.productVariantId },
    });

    if (cartItem) {
      cartItem.quantity += dto.quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: dto.productId,
        productVariantId: dto.productVariantId,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.recalculateTotal(cart.id);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.getCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity !== undefined) {
      cartItem.quantity = dto.quantity;
    }

    if (dto.newVariantId !== undefined && dto.newVariantId !== cartItem.productVariantId) {
      const newVariant = await this.variantRepository.findOne({
        where: { id: dto.newVariantId, productId: cartItem.productId }
      });
      if (!newVariant) {
        throw new BadRequestException('New variant is invalid for this product');
      }

      // Check if this new variant already exists in another cart item
      const existingItem = await this.cartItemRepository.findOne({
        where: { cartId: cart.id, productVariantId: dto.newVariantId }
      });

      if (existingItem) {
        // Merge them
        existingItem.quantity += cartItem.quantity;
        await this.cartItemRepository.save(existingItem);
        await this.cartItemRepository.remove(cartItem);
      } else {
        cartItem.productVariantId = dto.newVariantId;
        await this.cartItemRepository.save(cartItem);
      }
    } else {
      await this.cartItemRepository.save(cartItem);
    }

    return this.recalculateTotal(cart.id);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (cartItem) {
      await this.cartItemRepository.remove(cartItem);
    }

    return this.recalculateTotal(cart.id);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const cartItems = await this.cartItemRepository.find({ where: { cartId: cart.id } });
    if (cartItems.length > 0) {
      await this.cartItemRepository.remove(cartItems);
    }
    cart.items = [];
    cart.totalAmount = 0;
    return this.cartRepository.save(cart);
  }

  private async recalculateTotal(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.productVariant', 'items.productVariant.product', 'items.productVariant.images'],
    });

    if (!cart) throw new NotFoundException('Cart not found');

    let total = 0;
    for (const item of cart.items) {
      if (item.productVariant) {
        total += Number(item.productVariant.price) * item.quantity;
      }
    }

    cart.totalAmount = total;
    return this.cartRepository.save(cart);
  }
}
