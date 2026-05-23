import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SystemLogsService } from '@/modules/system-logs/system-logs.service';
import { SystemLogType } from '@/common/enums/system-log-type.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly systemLogsService: SystemLogsService,
  ) {}

  async findAll(paginationDto: PaginationDto, rating?: number, isApproved?: boolean) {
    const { page = 1, limit = 10 } = paginationDto;
    const queryBuilder = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product');

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    if (isApproved !== undefined) {
      queryBuilder.andWhere('review.isApproved = :isApproved', { isApproved });
    }

    queryBuilder.orderBy('review.createdAt', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async updateStatus(id: string, isApproved: boolean, user?: any): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    review.isApproved = isApproved;
    const updated = await this.reviewsRepository.save(review);

    if (user) {
      await this.systemLogsService.logAction(
        user.id,
        user.email,
        isApproved ? 'Duyệt đánh giá' : 'Từ chối đánh giá',
        `Đánh giá ID: ${id}`,
        SystemLogType.UPDATE,
      );
    }

    return updated;
  }

  async reply(id: string, replyComment: string, user?: any): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    review.replyComment = replyComment;
    review.repliedAt = new Date();
    const updated = await this.reviewsRepository.save(review);

    if (user) {
      await this.systemLogsService.logAction(
        user.id,
        user.email,
        'Phản hồi đánh giá',
        `Đánh giá ID: ${id}`,
        SystemLogType.UPDATE,
      );
    }

    return updated;
  }


  async remove(id: string): Promise<void> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    await this.reviewsRepository.remove(review);
  }
}
