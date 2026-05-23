import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('rating') rating?: number,
    @Query('isApproved') isApproved?: string,
  ) {
    const isApprovedBool =
      isApproved === 'true' ? true : isApproved === 'false' ? false : undefined;
    const data = await this.reviewsService.findAll(
      paginationDto,
      rating ? Number(rating) : undefined,
      isApprovedBool,
    );
    return {
      success: true,
      message: 'Reviews retrieved successfully',
      data,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isApproved') isApproved: boolean,
  ) {
    const data = await this.reviewsService.updateStatus(id, isApproved, req.user);
    return {
      success: true,
      message: 'Review status updated successfully',
      data,
    };
  }

  @Patch(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async reply(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('replyComment') replyComment: string,
  ) {
    const data = await this.reviewsService.reply(id, replyComment, req.user);
    return {
      success: true,
      message: 'Review replied successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.reviewsService.remove(id);
    return {
      success: true,
      message: 'Review deleted successfully',
      data: null,
    };
  }
}
