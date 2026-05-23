import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll(@Request() req: any) {
    const data = await this.wishlistsService.findAll(req.user.id);
    return {
      success: true,
      message: 'Wishlist retrieved successfully',
      data,
    };
  }

  @Post()
  async create(@Request() req: any, @Body('productId', ParseUUIDPipe) productId: string) {
    const data = await this.wishlistsService.create(req.user.id, productId);
    return {
      success: true,
      message: 'Product added to wishlist successfully',
      data,
    };
  }

  @Delete(':productId')
  async remove(@Request() req: any, @Param('productId', ParseUUIDPipe) productId: string) {
    await this.wishlistsService.remove(req.user.id, productId);
    return {
      success: true,
      message: 'Product removed from wishlist successfully',
      data: null,
    };
  }
}
