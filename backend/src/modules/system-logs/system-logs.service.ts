import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog } from './entities/system-log.entity';
import { SystemLogType } from '@/common/enums/system-log-type.enum';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog)
    private readonly systemLogsRepository: Repository<SystemLog>,
  ) {}

  async logAction(
    userId: string,
    userEmail: string,
    action: string,
    target: string,
    type: SystemLogType,
    ip?: string,
  ): Promise<SystemLog> {
    const log = this.systemLogsRepository.create({
      userId,
      userEmail,
      action,
      target,
      type,
      ip,
    });
    return this.systemLogsRepository.save(log);
  }

  async findAll(paginationDto: PaginationDto, type?: SystemLogType, search?: string) {
    const { page = 1, limit = 10 } = paginationDto;
    const queryBuilder = this.systemLogsRepository.createQueryBuilder('log');

    if (type) {
      queryBuilder.andWhere('log.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(log.action LIKE :search OR log.userEmail LIKE :search OR log.target LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('log.createdAt', 'DESC');
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
}
